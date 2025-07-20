import useDarkmode from "../../hooks/useDarkmode";
import { cn, formatNumber } from "../../utils/utils";

const OrderItem = ({ item } : { item : OrderItem}) => {
    const isDark = useDarkmode();

    return (
        <div key={item._id} className={cn("flex flex-wrap justify-between items-start pb-5 border-b-1", isDark ? 'border-gray-700' : 'border-gray-300')}>
            <div className="lg:w-[50%] flex gap-5">
                <img className='w-15 h-15' src={item.image || ''} alt="" />
                <div>
                    <h1 className="font-bold mb-4">{item.product_name}</h1>
                    {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                        <p key={value} className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{key}: {value}</p>
                    ))}
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>₱{formatNumber(item.price)}</p>
                    <p className={cn("mb-2 text-gray-500", isDark && 'text-gray-400')}>{item.quantity}</p>
                </div>
            </div>
            <h1 className="font-bold">₱{formatNumber(item.lineTotal)}</h1>
        </div>
    )
}

export default OrderItem;