import Card from "../../cards/Card";
import OrderItem from "./OrderItem";

const OrderItemsContainer = ({ orderItems, orderStatus } : { orderItems : Order['orderItems'], orderStatus: string}) => {
    return (
        <Card className="flex flex-col gap-10 p-5 rounded-lg">
            <h1 className="font-bold text-xl">Items:</h1>
            {orderItems?.map(item => <OrderItem key={item._id} item={item} orderStatus={orderStatus} />)}
        </Card>
    )            
}

export default OrderItemsContainer