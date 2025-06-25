import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { fetchData } from "../../../services/api";
import { formatToLongDateFormat } from "../../../utils/dateUtils";
import { StatusSelect } from "../../../components/Select";
import { Statuses } from "../../../constants/status";
import { formatNumber } from "../../../utils/utils";
import { Avatar } from "@mui/material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import BreadCrumbs from "../../../components/BreadCrumbs";

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState<Order>();

    const PageBreadCrumbs : { label: string, href: string }[] = [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Orders', href: '/admin/orders' },
        { label: 'Details', href: `/admin/orders/${id}`}
    ]

    useEffect(() => {
        const getOrderAsync = async () => {
            const response = await fetchData(`/api/order/${id}`)
            if(response.success){
                setOrder(response.order)
            }else{
                window.location.href = '/admin/dashboard'
            }
        }

        getOrderAsync();
    }, [id])

    if(!order) return null

    return <div className="flex flex-col justify-start bg-gray-100 min-h-screen">
        <div className="p-5 bg-white border-b-1 border-gray-300">
            <h1 className="font-bold text-2xl mb-6">{order?.order_id}</h1>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
        </div>
        <div className="flex items-start p-5 gap-10">
            <div className="flex flex-col gap-10 flex-1 bg-white p-5 rounded-lg border-1 border-gray-300 shadow-md">
                <h1 className="font-bold text-xl">Items:</h1>
                {order.orderItems?.map(item => (
                    <div className="flex justify-between items-start pb-5 border-b-1 border-gray-300">
                        <div className="w-[50%] flex gap-5">
                            <img className='w-15 h-15' src={item.image || ''} alt="" />
                            <div className="">
                                <h1 className="font-bold mb-4">{item.product_name}</h1>
                                {item.attributes && Object.entries(item.attributes).map(([key, value]) => (
                                    <p className="mb-2 text-gray-500">{key}: {value}</p>
                                ))}
                            </div>
                        </div>
                        <h1 className="font-bold">₱{formatNumber(item.price)}</h1>
                        <h1 className="font-bold">{item.quantity}</h1>
                        <h1 className="font-bold">₱{formatNumber(item.lineTotal)}</h1>
                    </div>
                ))}
            </div>
            <div className="w-[350px] flex flex-col gap-5">
                <div className="flex flex-col gap-5 w-full bg-white p-5 rounded-lg border-1 border-gray-300 shadow-md">
                    <div className="w-full">
                        <StatusSelect 
                            menu={Statuses}
                            value={order.status}
                            onChange={(e) => setOrder(prev => ({...prev!, status: e.target.value as Order['status']}))}
                        />
                    </div>
                </div>
                <div className="w-full bg-white p-5 flex flex-col gap-5 rounded-lg border-1 border-gray-300 shadow-md">
                    <h1 className="font-bold text-xl">Customer</h1>
                    <div className="flex gap-5 items-center pb-5 border-b-1 border-gray-300">
                        <Avatar />
                        <h1>{order.customer.firstname} {order.customer.lastname}</h1>
                    </div>
                    <div className="flex flex-col gap-5 pb-5 border-b-1 border-gray-300">
                        <h1 className="font-bold">Contact Info</h1>
                        <div className="flex gap-3">
                            <EmailOutlinedIcon />
                            <p>{order.customer.email || 'N/A'}</p>
                        </div>
                        <div className="flex gap-3">
                            <LocalPhoneOutlinedIcon />
                            <p>{order.customer.phone || 'N/A'}</p>
                        </div>
                    </div>
                    {order.address && <div className="flex flex-col gap-2 pb-5 border-b-1 border-gray-300">
                        <h1 className="font-bold">Address</h1>
                        <p>{order.address?.street}</p>
                        <p>{order.address?.barangay}</p>
                        <p>{order.address?.city}</p>
                        <p>{order.address?.region}</p>
                    </div>}
                    <p className="text-gray-500">Order Date: {formatToLongDateFormat(order?.createdAt)}</p>
                    <p className="text-gray-500">Order Source: {order.order_source}</p>
                </div>
                <div className="w-full bg-white p-5 rounded-lg border-1 border-gray-300 shadow-md">
                    <h1 className="font-bold mb-4">Note:</h1>
                    <p>{order.note || 'N/A'}</p>
                </div>
            </div>
        </div>
    </div>
}

export default OrderDetails