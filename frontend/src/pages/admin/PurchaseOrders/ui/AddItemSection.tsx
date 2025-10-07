import { useEffect, useState, useRef, useMemo } from "react";
import Card from "../../../../components/Card";
import useDarkmode from "../../../../hooks/useDarkmode";
import { RedButton } from "../../../../components/buttons/Button";
import useFetch from "../../../../hooks/useFetch";
import { useDebounce } from "../../../../hooks/useDebounce";

type ProductItem = {
    product_id: string;
    product_name: string;
    image: string;
    sku: string;
    availableStock: number;
};

type AddItemSectionProps = {
    addItem: (item: PurchaseOrderItem) => void;
};

const AddItemSection = ({ addItem }: AddItemSectionProps) => {
    const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [quantity, setQuantity] = useState<number>();
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const isDark = useDarkmode();
    const [price, setPrice] = useState<number>();
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data } = useFetch(`/api/products?searchTerm=${searchDebounce}&limit=20`);
    const products = useMemo<ProductItem[]>(() => {
        if(!searchTerm || !data?.products) return [];

        const products = data.products.flatMap((product: Product) => {
            if (product.product_type === "Variable") {
                return product.variants.map((variant) => ({
                    product_id: product._id,
                    product_name: product.product_name,
                    image: (product.thumbnail as UploadedImage).imageUrl,
                    sku: variant.sku,
                    availableStock: variant.stock,
                }));
            }

            return {
                product_name: product.product_name,
                image: (product.thumbnail as UploadedImage).imageUrl,
                sku: product.sku,
                availableStock: product.stock,
                product_id: product._id
            };
        });

        return products
    }, [data])

     useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        const handleSelect = (item: ProductItem) => {
            setSelectedItem(item);
            setSearchTerm(item.product_name);
            setShowDropdown(false);
        };
    
    const handleAdd = () => {
        if(!selectedItem || !quantity || !price) return; 
        addItem({
            product_id: selectedItem.product_id,
            sku: selectedItem.sku,
            quantity,
            price,
        })
    }

    return (
        <Card className="flex gap-5 items-center">
            <div ref={wrapperRef} className="relative w-full">
            {/* Search Input */}
            <input
                type="text"
                value={searchTerm}
                placeholder="Search products..."
                className={`w-full border p-3 rounded-lg border-gray-400 focus:border-2 focus:border-red-600 outline-none
                    ${isDark 
                    ? "text-white placeholder-gray-400" 
                    : "text-gray-900 placeholder-gray-500"
                    }`}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
            />

            {/* Dropdown */}
            {showDropdown && products.length > 0 && (
                <ul
                className={`absolute z-10 w-full border rounded-lg mt-2 max-h-72 overflow-y-auto shadow-xl
                    ${isDark 
                    ? "bg-gray-900 border-gray-700 text-white" 
                    : "bg-white border-gray-200 text-gray-800"
                    }`}
                >
                {products.map((product) => (
                    <li
                    key={product.sku}
                    className={`flex items-center gap-4 p-3 cursor-pointer transition
                        ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                    `}
                    onClick={() => handleSelect(product)}
                    >
                    <img
                        src={product.image}
                        alt={product.product_name}
                        className={`w-12 h-12 object-cover rounded-md border ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    />
                    <div className="flex-1">
                        <p className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                        {product.product_name}
                        </p>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        SKU: {product.sku}
                        </p>
                    </div>
                    <div className="text-right">
                        <p
                            className={`text-xs ${
                                product.availableStock > 0 ? "text-green-500" : "text-red-500"
                            }`}
                            >
                        {product.availableStock > 0
                            ? `${product.availableStock} in stock`
                            : "Out of stock"}
                        </p>
                    </div>
                    </li>
                ))}
                </ul>
            )}
            </div>
            <input
                type="number"
                disabled={!selectedItem}
                step="1"        
                min="0"
                value={price || ''}
                placeholder="Price"
                className={`no-spinner w-full border p-3 rounded-lg border-gray-400 focus:border-2 focus:border-red-600 outline-none
                    ${isDark 
                    ? "text-white placeholder-gray-400" 
                    : "text-gray-900 placeholder-gray-500"
                    }`}
                onKeyDown={(e) => {
                    if (e.key === "." || e.key === ",") {
                    e.preventDefault(); 
                    }
                }}
                onChange={(e) => setPrice(Number(e.target.value))}
            />
            <input
                type="number"
                disabled={!selectedItem}
                step="1"        
                min="0"
                value={quantity || ''}
                placeholder="Quantity"
                className={`no-spinner w-full border p-3 rounded-lg border-gray-400 focus:border-2 focus:border-red-600 outline-none
                    ${isDark 
                    ? "text-white placeholder-gray-400" 
                    : "text-gray-900 placeholder-gray-500"
                    }`}
                onKeyDown={(e) => {
                    if (e.key === "." || e.key === ",") {
                    e.preventDefault(); 
                    }
                }}
                onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <RedButton 
                disabled={!selectedItem || !quantity}
                onClick={handleAdd}
            >Add</RedButton>
        </Card>
    );
};

export default AddItemSection;
