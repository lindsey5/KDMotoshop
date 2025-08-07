import { useEffect, useState } from "react";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn, formatNumber } from "../../../utils/utils"
import { RedButton } from "../../buttons/Button";
import Card from "../../cards/Card";
import RateProductModal from "../../modals/RateProduct";
import { fetchData } from "../../../services/api";
import { Rating } from "@mui/material";

const CustomerOrderItem = ({ item, status } : { item : OrderItem, status: string }) => {
    const isDark = useDarkmode();
    const [ratingData, setRatingData] = useState<{orderItemId: string; product_id: string} | undefined>(undefined);
    const [review, setReview] = useState<Review>();

    const handleClose = () => {
        setRatingData(undefined)
    }

    useEffect(() => {
        const fetchReview = async () => {
            const response = await fetchData(`/api/review/item/${item._id}`);
            if(response.success) setReview(response.review);
        }

        if(item.status === 'Rated') fetchReview()
    }, [item])

    return (
        <>
        <RateProductModal 
            open={ratingData !== undefined} 
            close={handleClose}
            orderItemId={ratingData?.orderItemId ?? ''}
            product_id={ratingData?.product_id ?? ''}
        />
        <div key={item._id} className={cn("flex flex-wrap gap-5 justify-between items-start pb-5 border-b-1", isDark ? 'border-gray-700' : 'border-gray-300')}>
            <div className="flex flex-col md:flex-row gap-5">
                <img className='w-15 h-15' src={item.image || ''} alt="" />
                <div>
                    <h1 className="font-bold mb-4">{item.product_name}</h1>
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <p key={value} className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                    ))}
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>₱{formatNumber(item.price)} x {item.quantity}</p>
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{item.status}</p>
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
            <h1 className="font-bold">₱{formatNumber(item.lineTotal)}</h1>
            {status === 'Delivered' && item.status === 'Fulfilled' && (
                <RedButton onClick={() => setRatingData({ orderItemId: item._id ?? '', product_id: item.product_id })}>Rate Product</RedButton>
            )}
        </div>
        </>
    )
}


const CustomerOrderItems = ({ order } : { order : Order}) => {

    return (
        <Card className="flex flex-col gap-10 p-5 rounded-lg">
            <h1 className="font-bold text-xl">Items:</h1>
            {order.orderItems?.map(item => <CustomerOrderItem key={item._id} item={item} status={order.status} />)}
        </Card>
    )            
}

export default CustomerOrderItems