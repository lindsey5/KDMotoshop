import Card from "../../../../components/Card";
import OrderItem from "./OrderItem";

const OrderItemsContainer = ({ orderItems } : { orderItems : Order['orderItems'] }) => {
    return (
        <Card className="flex flex-col gap-10 p-5 rounded-lg">
            <h1 className="font-bold text-xl">Items:</h1>
            {orderItems?.map(item => <OrderItem key={item._id} item={item} />)}
        </Card>
    )            
}

export default OrderItemsContainer