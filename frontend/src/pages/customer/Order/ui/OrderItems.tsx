import { useEffect, useState } from "react";
import useDarkmode from "../../../../hooks/useDarkmode"
import { cn, formatNumberToPeso } from "../../../../utils/utils"
import { RedButton } from "../../../../components/buttons/Button";
import Card from "../../../../components/Card";
import RateProductModal from "../../../ui/RateProduct";
import { fetchData } from "../../../../services/api";
import { Button, Rating } from "@mui/material";
import { OrderItemStatusChip, RefundStatusChip } from "../../../../components/Chip";
import RequestRefundModal from "../../ui/CreateRefund";
import CustomerRefundRequestModal from "../../ui/CustomerRefundRequest";
import { isWithinLast7Days } from "../../../../utils/dateUtils";

const CustomerOrderItem = ({ item, status, deliveredAt } : { item : OrderItem, status: string, deliveredAt: Date | undefined }) => {
    const isDark = useDarkmode();
    const [ratingData, setRatingData] = useState<{orderItemId: string; product_id: string} | undefined>(undefined);
    const [review, setReview] = useState<Review>();
    const [showRequest, setShowRequest]= useState<boolean>(false);
    const [refund, setRefund] = useState<RefundRequest>();

    const handleClose = () => {
        setRatingData(undefined)
    }

    useEffect(() => {
        const fetchReview = async () => {
            const response = await fetchData(`/api/reviews/item/${item._id}`);
            if(response.success) setReview(response.review);
        }

        if(item.status === 'Rated') fetchReview()
    }, [item])

    return (
        <>
        {refund && <CustomerRefundRequestModal open={refund !== undefined} close={() => setRefund(undefined)} refundRequest={refund as RefundRequest}/>}
        <RateProductModal
            open={ratingData !== undefined} 
            close={handleClose}
            orderItemId={ratingData?.orderItemId ?? ''}
            product_id={ratingData?.product_id ?? ''}
        />
        <RequestRefundModal id={item._id as string} open={showRequest} close={() => setShowRequest(false)}/>
        <div key={item._id} className={cn("flex flex-wrap gap-5 justify-between items-start pb-5 border-b-1", isDark ? 'border-gray-700' : 'border-gray-300')}>
            <div className="md:text-base text-sm w-1/2 flex flex-col md:flex-row gap-5">
                <div className="flex gap-5">
                    <img className='w-15 h-15' src={item.image || ''} alt="" />
                    <h1 className="md:hidden block font-bold mb-4">{item.product_name}</h1>
                </div>
                <div>
                    <h1 className="md:block hidden font-bold mb-4">{item.product_name}</h1>
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <p key={value} className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                    ))}
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{formatNumberToPeso(item.price)} x {item.quantity}</p>
                    <div className="my-5">
                        <OrderItemStatusChip status={item.status} />
                    </div>
                    {item.refund && <div className="flex mb-4 gap-3">
                        <p className="text-gray-500">Refund Status:</p> {item.refund && <RefundStatusChip status={item.refund?.status} />}
                    </div>}
                    {review && (
                        <div>
                            <Rating 
                                name="read-only" 
                                value={review?.rating || 0} 
                                readOnly 
                            />
                            {review.review && <div className={cn("p-3 bg-gray-100 rounded-md mt-2", isDark && 'bg-gray-700')}>
                                <p>{review.review}</p>
                            </div>}
                        </div>
                    )}
                </div>
            </div>
            <h1 className="font-bold">{formatNumberToPeso(item.lineTotal)}</h1>
            <div className="flex justify-between md:flex-col gap-5">
                {status === 'Delivered' && item.status === 'Fulfilled' && (
                    <RedButton onClick={() => setRatingData({ orderItemId: item._id ?? '', product_id: item.product_id })}>Rate Product</RedButton>
                )}
                {item?.refund && <Button sx={{ color: isDark ? 'white' : 'red'}} onClick={() => setRefund(item?.refund)}>View Refund Status</Button>}
                {((status === 'Delivered' || status === 'Rated') && item.status === 'Fulfilled') && !item?.refund && isWithinLast7Days(deliveredAt) && <Button sx={{ color: isDark ? 'white' : 'red'}} onClick={() => setShowRequest(true)}>Refund Product</Button>}
            </div>
        </div>
        </>
    )
}


const CustomerOrderItems = ({ order } : { order : Order}) => {

    return (
        <Card className="flex flex-col gap-10 p-5 rounded-lg">
            <h1 className="font-bold text-xl">Items:</h1>
            {order.orderItems?.map(item => <CustomerOrderItem key={item._id}  deliveredAt={order.deliveredAt} item={item} status={order.status} />)}
        </Card>
    )            
}

export default CustomerOrderItems