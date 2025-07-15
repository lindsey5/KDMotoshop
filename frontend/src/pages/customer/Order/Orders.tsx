import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn } from "../../../utils/utils"
import { fetchData } from "../../../services/api";
import Card from "../../../components/Card";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'My Orders', href: '/orders' }
]

const CustomerOrders = () => {
    const isDark = useDarkmode();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const getOrders = async () => {
            const response = await fetchData('/api/order/customer');
            console.log(response)
            if(response.success) setOrders(response.orders)
        }

        getOrders();
    }, [])

    return (
        <div className={cn("flex flex-col gap-5 min-h-screen transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <h1 className="text-3xl font-bold text-red-500">My Orders</h1>
            
            {orders.map(order => (
                <Card>
                    <h1 className="text-2xl font-bold">{order.order_id}</h1>
                </Card>
            ))}

            
        </div>
    )
}

export default CustomerOrders