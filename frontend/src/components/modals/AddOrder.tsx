import { Modal } from "@mui/material";
import { useMemo, useState } from "react";
import { RedButton } from "../Button";
import { successAlert } from "../../utils/swal";
import { formatNumber } from "../../utils/utils";
import Counter from "../Counter";
import Attributes from "../Attributes";

type AddOrderModalProps = {
    selectedProduct: Product | undefined;
    setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>
    close: () => void;
}

const AddOrderModal : React.FC<AddOrderModalProps> = ({ close, selectedProduct, setOrderItems }) => {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);

    const filteredVariants = useMemo(() => {
        setQuantity(1)
        if (!selectedProduct) { return [] };

        return selectedProduct.variants.filter((variant) =>
            Object.entries(selectedAttributes).every(
                ([key, value]) => variant.attributes[key] === value
            )
        );
    }, [selectedProduct, selectedAttributes]);

    const handleSelect = (attribute: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attribute]: value,
        }));
    };

    const handleAddOrder = () => {
        setOrderItems(prev => {
            const existingIndex = prev.findIndex(
                o => o.product_id === selectedProduct?._id && o.variant_id === filteredVariants[0]._id
            );

            if (existingIndex !== -1)  return prev.map((o, i) =>
                i === existingIndex ? { 
                    ...o, 
                    quantity: o.quantity + quantity, 
                    sales: (o.quantity + quantity) * o.price 
                } 
            : o)

            return [
                ...prev,
                {
                    status: "Unfulfilled",
                    product_id: selectedProduct?._id || '',
                    variant_id: filteredVariants[0]._id,
                    attributes: filteredVariants[0].attributes,
                    product_name: selectedProduct?.product_name || '',
                    quantity,
                    stock: filteredVariants[0].stock || 0,
                    price: filteredVariants[0]?.price || 0,
                    lineTotal: (filteredVariants[0].price || 0) * quantity,
                    image: selectedProduct && typeof selectedProduct.thumbnail === 'object' && selectedProduct.thumbnail !== null && 'imageUrl' in selectedProduct.thumbnail
                            ? selectedProduct.thumbnail.imageUrl
                            : null,
                }
            ];
        });
        close();
        successAlert('Order Added', 'Order successfully added');
    };
    

    return <Modal 
        open={selectedProduct !== undefined} 
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        onClose={close}
    >
        <div className="w-[90%] max-w-[800px] flex gap-10 p-10 bg-white rounded-md">
            <div className="flex flex-col">
                <img 
                    className="w-[250px] bg-gray-100 h-[150px] lg:h-[230px]"
                    src={
                        selectedProduct && typeof selectedProduct.thumbnail === 'object' && selectedProduct.thumbnail !== null && 'imageUrl' in selectedProduct.thumbnail
                        ? selectedProduct.thumbnail.imageUrl
                        : selectedProduct && typeof selectedProduct.thumbnail === 'string'
                            ? selectedProduct.thumbnail
                            : '/photo.png'
                    }
                />
            </div>
            <div className="flex-1 flex flex-col gap-10">
                <h1 className="font-bold text-2xl">{selectedProduct?.product_name}</h1>
                {filteredVariants.length === 1 && Object.keys(selectedAttributes).length === selectedProduct?.attributes.length && (
                    <h1 className="text-3xl font-bold text-red-500">₱{formatNumber(filteredVariants[0]?.price || 0)}</h1>
                )}
                {filteredVariants.length !== 1 && Object.keys(selectedAttributes).length === selectedProduct?.attributes.length && (
                    <h1 className="text-red-500">Not Available</h1>
                )}
                <div className="flex flex-col gap-4 mb-4">
                    <Attributes 
                        product={selectedProduct}
                        handleSelect={handleSelect}
                        selectedAttributes={selectedAttributes}
                    />
                    <Counter 
                        value={quantity} 
                        setValue={setQuantity} 
                        limit={filteredVariants[0]?.stock || 1}
                        disabled={filteredVariants[0]?.stock === 0 || filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== selectedProduct?.attributes.length}
                    />
                </div>
                <RedButton
                    onClick={handleAddOrder}
                    disabled={filteredVariants[0]?.stock === 0 || filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== selectedProduct?.attributes.length}
                >
                    Add Order
                </RedButton>
            </div>
        </div>
    </Modal>
}

export default AddOrderModal