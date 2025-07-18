import useDarkmode from "../../../hooks/useDarkmode"
import { cn, formatNumber } from "../../../utils/utils"
import Card from "../../cards/Card";

const ItemContainer = ({ item } : { item : OrderItem}) => {
    const isDark = useDarkmode();

    return (
        <div key={item._id} className={cn("flex justify-between items-start pb-5 border-b-1", isDark ? 'border-gray-700' : 'border-gray-300')}>
            <div className="w-[50%] flex gap-5">
                <img className='w-15 h-15' src={item.image || ''} alt="" />
                <div>
                    <h1 className="font-bold mb-4">{item.product_name}</h1>
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <p key={value} className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                    ))}
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{item.status}</p>
                </div>
            </div>
            <h1 className="font-bold">₱{formatNumber(item.price)}</h1>
            <h1 className="font-bold">{item.quantity}</h1>
            <h1 className="font-bold">₱{formatNumber(item.lineTotal)}</h1>
        </div>
    )
}

const OrderItemsContainer = ({ orderItems } : { orderItems : Order['orderItems']}) => {
    return (
        <Card className="flex flex-col gap-10 p-5 rounded-lg">
            <h1 className="font-bold text-xl">Items:</h1>
            {orderItems?.map(item => <ItemContainer item={item} />)}
        </Card>
    )            
}

export default OrderItemsContainer