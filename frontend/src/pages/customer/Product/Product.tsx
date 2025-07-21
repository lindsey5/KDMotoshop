import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchData, postData } from "../../../services/api";
import Counter from "../../../components/Counter";
import Attributes from "../../../components/Attributes";
import { cn, formatNumber } from "../../../utils/utils";
import { ExpandableText } from "../../../components/text/Text";
import { RedButton } from "../../../components/Button";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { CircularProgress, Rating } from "@mui/material";
import useDarkmode from "../../../hooks/useDarkmode";
import { CustomerContext } from "../../../context/CustomerContext";
import { successAlert } from "../../../utils/swal";
import { CartContext } from "../../../context/CartContext";
import MultiImageSlideshow from "../../../components/images/MultiImageSlideShow";
import ProductThumbnail from "../../../components/images/ProductThumbnail";
import ProductReviews from "./ProductReviews";

const CustomerProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product>();
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState<number>(1);
    const isDark = useDarkmode();
    const { cart, setCart } = useContext(CartContext);
    const { customer } = useContext(CustomerContext);
    const navigate = useNavigate();
    const [totalReviews, setTotalReviews] = useState<number>(0);
    
    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products'},
        { label: product?.product_name || "", href: `/product/${product?._id}`}
    ]

    useEffect(() => {
        const fetchDataAsync = async () => {
            const [productResponse, reviewsResponse] = await Promise.all([
                fetchData(`/api/product/${id}/reserved`),   
                fetchData(`/api/review/product/${id}`)
            ]);

            console.log(productResponse)

            productResponse.success ?  setProduct(productResponse.product) : navigate('/products');
            if (reviewsResponse.success) setTotalReviews(reviewsResponse.totalReviews);
        }

        fetchDataAsync();
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

    if(!product) return (
        <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
            <CircularProgress sx={{ color: 'red'}}/>
         </div>
    )

    const addToCart = async () => {
        if(customer){
            const newItem : Cart = {
                customer_id: customer._id,
                product_id: product._id ?? '',
                variant_id: product.product_type === 'Single' ? null : filteredVariants[0]._id ?? null,
                quantity: quantity,
            } 
            const response = await postData('/api/cart', newItem);
            if(response.success){
                const existedCartIndex = cart.findIndex(item => item._id === response.cart._id);

                existedCartIndex !== -1 ? setCart(cart.map((item, index) => (
                    index === existedCartIndex ? {...item, quantity: item.quantity + newItem.quantity} : item
                ))) : setCart(prev => [...prev, {
                    ...response.cart, 
                    isSelected: true,
                    attributes: selectedAttributes,
                    stock:  product.product_type === 'Single' ? product.stock : filteredVariants[0].stock,
                    product_name: product.product_name,
                    price: product.product_type === 'Single' ? product.price : filteredVariants[0].price,
                    image: typeof product?.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                        ? product.thumbnail.imageUrl
                            : typeof product?.thumbnail === 'string'
                            ? product.thumbnail
                        : '/photo.png'
                }])
                successAlert('Added to Cart', 'You can view it in your cart anytime.', isDark);
            }
        }else{
            navigate('/login')
        }
    }

    const proceedToCheckout = () => {
        if(customer){
            const items = [{
                product_id: product._id,
                variant_id: product.product_type === 'Single' ? '' : filteredVariants[0]._id ?? '',
                quantity: quantity
            }]
            
            localStorage.setItem('items', JSON.stringify(items))
            localStorage.removeItem('cart')
            navigate('/checkout')
        }else{
            navigate('/login')
        }
    }

    return (
         <div className={cn("pt-25 bg-gray-100 md:px-10 px-5 pb-10", isDark && 'bg-[#1e1e1e]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
            <div className="flex flex-col lg:flex-row gap-10 py-10">
                <div className="flex gap-5 items-start flex-col lg:items-center">
                    <ProductThumbnail 
                        product={product} 
                        className={cn("w-[200px] h-[200px] lg:w-[350px] lg:h-[350px] 2xl:w-[500px] 2xl:h-[500px] shadow-lg")}
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
                <div className={cn("flex flex-col gap-5 flex-1 p-5 bg-white rounded-md border border-gray-300 shadow-xl", isDark && 'bg-[#121212] border-gray-500 text-white')}>
                    <h1 className="font-bold text-3xl">{product?.product_name}</h1>
                    {product.rating !== 0 ? <div>
                        <div className="flex gap-3 items-center">
                            <Rating sx={{ fontSize: 35 }} name="read-only" value={product.rating} readOnly />
                            <p className="text-xl">{product.rating} / 5</p>
                        </div>
                        <p className="text-xl">({totalReviews} Reviews)</p>
                    </div> : <p className={cn("text-gray-500", isDark && 'text-white')}>No Reviews</p>}
                    {product?.product_type === 'Variable' ? 
                        (filteredVariants.length > 0 ? 
                            <h1 className="font-bold text-3xl">₱{formatNumber((
                                product?.product_type === 'Variable' ? 
                                    filteredVariants?.[0]?.price 
                                    : product?.price) ?? 0)}
                            </h1>
                        : <h1 className="text-red-500">Not Available</h1>)
                    : <h1 className="font-bold text-2xl">₱{formatNumber(product?.price ?? 0)}</h1>}

                    <p className="text-lg">Stock: {product?.product_type === 'Variable' ? filteredVariants[0] ? filteredVariants[0]?.stock : 'none' : product?.stock}</p>

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
                            onClick={proceedToCheckout}
                            fullWidth
                            disabled={product?.product_type === 'Variable' ? (filteredVariants[0]?.stock === 0 || filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== product?.attributes.length) : product?.stock === 0}
                        >Buy</RedButton>
                        <RedButton 
                            sx={{ height: 45 }}
                            onClick={addToCart}
                            fullWidth
                            disabled={product?.product_type === 'Variable' ? (filteredVariants[0]?.stock === 0 || filteredVariants.length !== 1 || Object.keys(selectedAttributes).length !== product?.attributes.length) : product?.stock === 0}
                        >Add to cart</RedButton>
                    </div>
                </div>
            </div>
            <ProductReviews product_id={product._id ?? ''} />
         </div>
    )
}

export default CustomerProduct