import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn } from "../../../utils/utils"
import { fetchData } from "../../../services/api";
import Card from "../../../components/cards/Card";
import { formatDateWithWeekday } from "../../../utils/dateUtils";
import { RedButton } from "../../../components/buttons/Button";
import { Status, Title } from "../../../components/text/Text";
import { StatusSelect } from "../../../components/Select";
import { Statuses } from "../../../constants/status";
import CustomizedPagination from "../../../components/Pagination";
import { Navigate, useNavigate } from "react-router-dom";
import FuzzyText from "../../../components/text/FuzzyText";
import OrderItem from "../../../components/containers/admin/OrderItem";
import usePagination from "../../../hooks/usePagination";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'My Orders', href: '/orders' }
]

const CustomerOrders = () => {
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [loading, setLoading] = useState<boolean>(true);
    const { pagination, setPagination } = usePagination();
    const { user : customer, loading : customerLoading } = useSelector((state : RootState) => state.user)
    
    useEffect(() => {
        const getOrders = async () => {
            setLoading(true);
            const today = new Date();
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(today.getDate() - 60);
            const response = await fetchData(`/api/orders/customer?page=${pagination.page}&limit=10&status=${selectedStatus}&startDate=${sixtyDaysAgo}&endDate=${new Date()}`);
            if(response.success) {
                setOrders(response.orders)
                setPagination(prev => ({...prev, totalPages: response.totalPages }));
            }
            setLoading(false);
        }

        getOrders();
    }, [selectedStatus, pagination.page])

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    if(loading) return (
        <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
            <CircularProgress sx={{ color: 'red'}}/>
        </div>
    )

    if (!customer && !customerLoading) {
        return <Navigate to="/" />;
    }

    return (
        <div className={cn("flex flex-col gap-5 min-h-screen transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <div className="flex flex-col md:flex-row justify-between gap-5">
                <Title className="text-2xl md:text-4xl">My Orders</Title>
                <div className="flex-1 md:max-w-sm">
                    <StatusSelect 
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as string)}
                        menu={Statuses}
                    />
                </div>
            </div>
            {!loading && orders.length === 0 && <div className="flex flex-col gap-5 items-center p-30">
                <img className="w-[200px] h-[200px]" src={isDark ? "/white-cart.png" : "/cart.png"} />
                <FuzzyText 
                    baseIntensity={0.2} 
                    hoverIntensity={0.5} 
                    enableHover={true}
                    color={isDark ? 'white' : 'black'}
                    fontSize={55}
                    >
                    No Orders Found
                </FuzzyText>
                <strong className={cn("text-xl", isDark ? 'text-gray-300' : 'text-black')}>Status: {selectedStatus}</strong>
            </div>}
            {orders.map(order => (
                <Card key={order._id} className="flex flex-col gap-5">
                    <div className={cn("flex items-start justify-between items-center gap-5 pb-5 border-b-1 border-gray-300", isDark && 'border-gray-600')}>
                        <div className="md:text-base text-sm flex flex-col items-start md:flex-row gap-3 md:items-center">
                             <span className={cn("font-bold px-3 py-2 bg-gray-200 rounded-full", isDark && 'bg-gray-700 text-white')}>{order.order_id}</span>
                             <span className="text-gray-400">Order Date: {formatDateWithWeekday(order.createdAt)}</span>
                        </div>
                        <Status status={order.status} isDark={isDark}/>
                    </div>
                    {order.orderItems?.slice(0, 1)?.map(item => <OrderItem key={item._id} item={item}/>)}
                    {(order.orderItems?.length ?? 0) > 1 && <h1 className="text-center">{(order.orderItems?.length ?? 0) - 1} more items</h1>}
                    <div className="flex justify-end">
                        <RedButton onClick={() => navigate(`/order/${order._id}`)}>{order.status === 'Delivered' ? 'Rate your order' : 'Track Order'}</RedButton>
                    </div>
                </Card>
            ))}
        {orders.length > 0 && <CustomizedPagination page={pagination.page} count={pagination.totalPages} onChange={handlePage} />}
        </div>
    )
}

export default CustomerOrders