import { Button, IconButton, Modal } from "@mui/material";
import { useMemo, useState } from "react";
import { RedButton } from "../Button";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { successAlert } from "../../utils/swal";
import { formatNumber } from "../../utils/utils";

interface AddOrderModalProps{
    selectedProduct: Product | undefined;
    setOrders: React.Dispatch<React.SetStateAction<Sale[]>>
    close: () => void;
}

const AddOrderModal : React.FC<AddOrderModalProps> = ({ close, selectedProduct, setOrders }) => {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);

    const filteredVariants = useMemo(() => {
        if (!selectedProduct) { return [] };

        setQuantity(1)

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

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => (prev - 1 ));
    };

    const handleAddOrder = () => {
        setOrders(prev => {
            const existingIndex = prev.findIndex(
                o => o.product_id === selectedProduct?._id && o.variant_id === filteredVariants[0]._id
            );

            if (existingIndex !== -1)  return prev.map((o, i) =>
                i === existingIndex ? { 
                    ...o, 
                    quantity: (o.quantity + quantity) > o.stock ? o.stock : o.quantity + quantity, 
                    sales: (o.quantity + quantity) * o.price 
                } 
            : o)

            return [
                ...prev,
                {
                    product_id: selectedProduct?._id || '',
                    variant_id: filteredVariants[0]._id,
                    attributes: filteredVariants[0].attributes,
                    product_name: selectedProduct?.product_name || '',
                    quantity,
                    stock: filteredVariants[0].stock || 0,
                    price: filteredVariants[0]?.price || 0,
                    sales: (filteredVariants[0].price || 0) * quantity
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
                    {selectedProduct?.attributes.map(attribute => {
                        const values = [
                            ...new Set(
                            selectedProduct?.variants?.flatMap((variant) =>
                                Object.entries(variant.attributes)
                                .filter(([key]) => key === attribute)
                                .map(([, value]) => value)
                            ) ?? []
                            ),
                        ];

                        return (
                            <div key={attribute}>
                                <h1 className="mb-2">{attribute}</h1>
                                <div className="flex flex-wrap gap-2">
                                    {values.map((value) => (
                                    <Button
                                        sx={{...selectedAttributes[attribute] === value ? { 'backgroundColor' : 'red' } : { color: 'black', borderColor: 'black'}}}
                                        key={value}
                                        variant={
                                        selectedAttributes[attribute] === value
                                            ? "contained"
                                            : "outlined"
                                        }
                                        onClick={() => handleSelect(attribute, value)}
                                    >
                                        {value}
                                    </Button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    <div>
                        <h1 className="mb-2">Quantity</h1>
                        <div className="flex gap-2">
                            <IconButton onClick={decrementQuantity} disabled={quantity === 1 || (filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== selectedProduct?.attributes.length)}>
                                <RemoveIcon />
                            </IconButton>
            
                            <input
                                className="w-16 px-2 outline-none text-center border-1 border-gray-300"
                                disabled
                                value={quantity}
                            />
                            <IconButton onClick={incrementQuantity} disabled={quantity === filteredVariants[0]?.stock || (filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== selectedProduct?.attributes.length)}>
                                <AddIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <RedButton
                    onClick={handleAddOrder}
                    disabled={filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== selectedProduct?.attributes.length}
                >
                    Add Order
                </RedButton>
            </div>
        </div>
    </Modal>
}

export default AddOrderModal