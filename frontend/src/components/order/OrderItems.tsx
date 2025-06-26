import { formatNumber } from "../../utils/utils"

const OrderItems = ({ orderItems } : { orderItems : Order['orderItems']}) => {
    return (
        <div className="flex flex-col gap-10 bg-white p-5 rounded-lg border-1 border-gray-300 shadow-md">
            <h1 className="font-bold text-xl">Items:</h1>
            {orderItems?.map(item => (
                <div className="flex justify-between items-start pb-5 border-b-1 border-gray-300">
                    <div className="w-[50%] flex gap-5">
                        <img className='w-15 h-15' src={item.image || ''} alt="" />
                        <div className="">
                            <h1 className="font-bold mb-4">{item.product_name}</h1>
                            {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                                <p className="mb-2 text-gray-500">{key}: {value}</p>
                            ))}
                            <p>{item.status}</p>
                        </div>
                    </div>
                    <h1 className="font-bold">₱{formatNumber(item.price)}</h1>
                    <h1 className="font-bold">{item.quantity}</h1>
                    <h1 className="font-bold">₱{formatNumber(item.lineTotal)}</h1>
                </div>
            ))}
        </div>
    )            
}

export default OrderItems