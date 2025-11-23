import { Button, Modal } from "@mui/material";
import Card from "../../../../components/Card";
import Attributes from "../../../../components/Attributes";
import { useMemo, useState } from "react";
import { RedButton } from "../../../../components/buttons/Button";

interface ProductModalProps {
    selectedProduct: Product | undefined;
    addItem: (product : Product, sku : string) => void;
    close: () => void;

}
const ProductModal = ({ selectedProduct, close, addItem } : ProductModalProps) => {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

    const handleSelect = (attribute: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attribute]: value,
        }));
    };

    const selectedVariant = useMemo(() => {
        if (!selectedProduct || Object.entries(selectedAttributes).length !== selectedProduct?.attributes.length) return undefined;
    
        return selectedProduct.variants.filter((variant) =>
            Object.entries(selectedAttributes).every(
                ([key, value]) => variant.attributes[key] === value
            )
        ).sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
    }, [selectedProduct, selectedAttributes]);


    return (
        <Modal
            open={selectedProduct !== undefined} 
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            onClose={close}
        >
            <Card className="w-full md:max-w-128 flex flex-col gap-5">
                <div className="flex gap-8">
                    <img 
                        className="bg-gray-100 w-30 h-30 object-contain"
                        src={
                            typeof selectedProduct?.thumbnail === 'object' && selectedProduct.thumbnail !== null && 'imageUrl' in selectedProduct.thumbnail
                                ? selectedProduct?.thumbnail.imageUrl
                                    : typeof selectedProduct?.thumbnail === 'string'
                                ? selectedProduct?.thumbnail
                            : '/photo.png'
                        }
                    />
                    <div className="space-y-2">
                        <h1 className="font-bold text-lg">{selectedProduct?.product_name}</h1>
                        {!selectedVariant && Object.entries(selectedAttributes).length === selectedProduct?.attributes.length ? <p className="text-red-500">Not Available</p> :
                            <>
                            {selectedVariant && selectedVariant?.stock === 0 ? <p className="text-red-500">Out of stock</p> : <p>Stock: {selectedVariant?.stock}</p>}
                            </>
                        }
                    </div>
                </div>

                <Attributes 
                    product={selectedProduct}
                    handleSelect={handleSelect}
                    selectedAttributes={selectedAttributes}
                />
                <div className="flex justify-end gap-5">
                    <Button
                        variant="outlined"
                        onClick={close}
                        sx={{ color: 'gray', borderColor: 'gray' }}
                    >
                        Close
                    </Button>
                    <RedButton 
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                        onClick={() => {
                            if(selectedProduct && selectedVariant){
                                addItem(selectedProduct, selectedVariant?.sku || '');
                                close();
                            }
                        }}
                    >Add Item</RedButton>
                </div>
            </Card>

        </Modal>
    )
}

export default ProductModal;