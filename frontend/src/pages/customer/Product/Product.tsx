import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchData } from "../../../services/api";
import { ProductThumbnail, MultiImageSlideshow } from "../../../components/Image";
import Counter from "../../../components/Counter";
import Attributes from "../../../components/Attributes";
import { formatNumber } from "../../../utils/utils";
import { ExpandableText } from "../../../components/Text";
import { RedButton } from "../../../components/Button";
import BreadCrumbs from "../../../components/BreadCrumbs";

const CustomerProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>();
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products'},
        { label: product?.product_name || "", href: `/product/${product?._id}`}
    ]

    useEffect(() => {
        const getProduct = async () => {
            const response = await fetchData(`/api/product/${id}/reserved`)
            if(response.success) setProduct(response.product)
            
        }

        getProduct();
    }, [])

    const filteredVariants = useMemo(() => {
        setQuantity(1)
        if (!product) { return [] };
    
        return product.variants.filter((variant) =>
            Object.entries(selectedAttributes).every(
                ([key, value]) => variant.attributes[key] === value
            )
        ).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }, [product, selectedAttributes]);

    const handleSelect = (attribute: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attribute]: value,
        }));
    };


    return (
         <div className="pt-25 bg-gray-100 px-10 pb-5">
            <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
            <div className="flex flex-col lg:flex-row gap-10 py-10 bg-gray-100">
                <div className="flex flex-col gap-5 items-center">
                    <ProductThumbnail 
                        product={product} 
                        className="w-[350px] h-[350px] 2xl:w-[500px] 2xl:h-[500px]"
                    />
                    <MultiImageSlideshow 
                            images={
                                product?.images.map(image => (
                                typeof image === 'object' && 'imageUrl' in image
                                ? image.imageUrl
                                    : typeof image === 'string'
                                    ? image
                                : '/photo.png'
                                )) || []
                            }
                        
                        />
                </div>
                <div className="flex flex-col gap-5 flex-1 p-5 bg-white rounded-md border border-gray-300 shadow-lg">
                    <h1 className="font-bold text-3xl">{product?.product_name}</h1>
                    {product?.product_type === 'Variable' ? filteredVariants.length > 0 ? 
                        <h1 className="font-bold text-3xl">₱{formatNumber((product?.product_type === 'Variable' ? filteredVariants?.[0]?.price : product?.price) ?? 0)}</h1>
                    : <h1 className="text-red-500">Not Available</h1>
                
                    : <h1 className="font-bold text-2xl">₱{formatNumber(product?.price ?? 0)}</h1>}
                    <div className="flex flex-col gap-4 mb-4">
                        <Attributes 
                            product={product}
                            handleSelect={handleSelect}
                            selectedAttributes={selectedAttributes}
                        />
                        <Counter 
                            value={quantity} 
                            setValue={setQuantity} 
                            limit={product?.product_type === 'Variable' ? filteredVariants[0]?.stock || 1 : product?.stock || 1}
                            disabled={product?.product_type === 'Variable' && (filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== product?.attributes.length)}
                        />
                    </div>
                    <strong>Description: </strong>
                    <ExpandableText text={product?.description} limit={80}/>
                    <div className="w-full flex gap-10">
                        <RedButton 
                            sx={{ height: 45 }}
                            fullWidth
                            disabled={product?.product_type === 'Variable' ? (filteredVariants[0]?.stock === 0 || filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== product?.attributes.length) : product?.stock === 0}
                        >Buy</RedButton>
                        <RedButton 
                            sx={{ height: 45 }}
                            fullWidth
                            disabled={product?.product_type === 'Variable' ? (filteredVariants[0]?.stock === 0 || filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== product?.attributes.length) : product?.stock === 0}
                        >Add to cart</RedButton>
                    </div>
                </div>
            </div>
         </div>
    )
}

export default CustomerProduct