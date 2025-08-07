import { useEffect, useState } from "react";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn, formatNumber } from "../../../utils/utils";
import { Rating } from "@mui/material";
import { fetchData } from "../../../services/api";
import { RedButton } from "../../buttons/Button";

const OrderItem = ({ item, orderStatus } : { item : OrderItem, orderStatus?: string}) => {
    const isDark = useDarkmode();
    const [review, setReview] = useState<Review>();

    useEffect(() => {
        const fetchReview = async () => {
            const response = await fetchData(`/api/review/item/${item._id}`);
            if(response.success) {
                setReview(response.review);
            }
        }
        if(item.status === 'Rated') fetchReview()
    }, [item])

    return (
        <div key={item._id} className={cn("flex flex-col md:flex-row justify-between items-start pb-5 border-b-1 gap-5", isDark ? 'border-gray-700' : 'border-gray-300')}>
            <div className="lg:w-[50%] flex gap-5">
                <img className='w-15 h-15' src={item.image || ''} alt="" />
                <div>
                    <h1 className="font-bold mb-4">{item.product_name}</h1>
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <p key={value} className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                    ))}
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>₱{formatNumber(item.price)}</p>
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{item.quantity}</p>
                    {review && (
                        <div>
                            <Rating 
                                name="read-only" 
                                value={review?.rating || 0} 
                                readOnly 
                            />
                            {review.review && <div className={cn("p-3 bg-gray-100 rounded-md mt-2", isDark && 'bg-gray-800')}>
                                <p>{review.review}</p>
                            </div>}
                        </div>
                    )}
                </div>
            </div>
             <h1>{item.status}</h1>
            <h1 className="font-bold">₱{formatNumber(item.lineTotal)}</h1>
            {orderStatus === 'Delivered' && (item.status === 'Fulfilled' || item.status === 'Rated') && <RedButton>Refund Item</RedButton>}
        </div>
    )
}

export default OrderItem;