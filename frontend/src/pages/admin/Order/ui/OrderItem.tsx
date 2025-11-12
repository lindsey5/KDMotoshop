import { useEffect, useState } from "react";
import useDarkmode from "../../../../hooks/useDarkmode";
import { cn, formatNumberToPeso } from "../../../../utils/utils";
import { Rating } from "@mui/material";
import { fetchData } from "../../../../services/api";
import { OrderItemStatusChip, RefundStatusChip } from "../../../../components/Chip";
import ProductReviewImageModal from "../../../ui/ProductReviewImage";

const OrderItem = ({ item } : { item : OrderItem }) => {
    const isDark = useDarkmode();
    const [review, setReview] = useState<Review>();
    const [showImage, setShowImage] = useState(false);

    useEffect(() => {
        const fetchReview = async () => {
            const response = await fetchData(`/api/reviews/item/${item._id}`);
            if(response.success) {
                setReview(response.review);
            }
        }
        if(item.status === 'Rated') fetchReview()
    }, [item])

    return (
        <div key={item._id} className={cn("flex flex-col md:flex-row justify-between items-start pb-5 border-b-1 gap-5", isDark ? 'border-gray-700' : 'border-gray-300')}>
            <ProductReviewImageModal 
                close={() => setShowImage(false)}
                image={review?.image?.imageUrl || ''}
                open={showImage}
            />
            <div className="lg:w-[50%] flex gap-5">
                <img className='w-15 h-15' src={item.image || ''} alt="" />
                <div className="md:text-base text-sm">
                    <h1 className="font-bold mb-4">{item.product_name}</h1>
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <p key={value} className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                    ))}
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{formatNumberToPeso(item.price)}</p>
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>QTY: {item.quantity}</p>
                    {item.refund?.status && <div className="flex gap-3">
                        <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>Refund Status:</p>
                        <RefundStatusChip status={item.refund?.status} />
                    </div>}
                    {review && (
                        <div>
                            <Rating 
                                name="read-only" 
                                value={review?.rating || 0} 
                                readOnly 
                            />
                            {review.review && (
                                <>
                                <div className={cn("p-3 bg-gray-100 rounded-md mt-2", isDark && 'bg-gray-700')}>
                                    <p>{review.review}</p>
                                </div>
                                {review.image && (
                                    <img 
                                        className="mt-4 cursor-pointer object-cover w-25 h-25 md:w-40 md:h-40" 
                                        src={review?.image?.imageUrl} 
                                        onClick={() => setShowImage(true)}
                                        alt="" 
                                    />
                                )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-3 my-5">
                <OrderItemStatusChip status={item.status} />
            </div>
            <h1 className="font-bold">{formatNumberToPeso(item.lineTotal)}</h1>
        </div>
    )
}

export default OrderItem;