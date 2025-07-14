import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn } from "../../../utils/utils"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'My Orders', href: '/orders' }
]

const CustomerOrders = () => {
    const isDark = useDarkmode();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const getOrders = () => {

        }

        getOrders();
    }, [])

    return (
        <div className={cn("min-h-screen transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <h1 className="text-3xl font-bold text-red-500 mt-4">My Orders</h1>
        </div>
    )
}

export default CustomerOrders