import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import useDarkmode from "../../../hooks/useDarkmode"
import { cn } from "../../../utils/utils"
import { fetchData } from "../../../services/api";
import Card from "../../../components/cards/Card";
import { formatDateWithWeekday } from "../../../utils/dateUtils";
import { RedButton } from "../../../components/Button";
import OrderItemsContainer from "../../../components/containers/admin/OrderItems";
import { Status } from "../../../components/text/Text";
import { CustomizedSelect } from "../../../components/Select";
import FilterListIcon from '@mui/icons-material/FilterList';
import { Statuses } from "../../../constants/status";
import { PaginationState } from "../../../constants/pagination";
import CustomizedPagination from "../../../components/Pagination";
import { useNavigate } from "react-router-dom";
import FuzzyText from "../../../components/text/FuzzyText";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'My Orders', href: '/orders' }
]

const CustomerOrders = () => {
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [pagination, setPagination] = useState<Pagination>(PaginationState);
    
    useEffect(() => {
        const getOrders = async () => {
            const today = new Date();
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(today.getDate() - 60);
            const response = await fetchData(`/api/order/customer?page=${pagination.page}&limit=10&status=${selectedStatus}&startDate=${sixtyDaysAgo}&endDate=${new Date()}`);
            if(response.success) {
                setOrders(response.orders)
                setPagination(prev => ({...prev, totalPages: response.totalPages }));
            }
        }

        getOrders();
    }, [selectedStatus])

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    return (
        <div className={cn("flex flex-col gap-5 min-h-screen transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <h1 className="text-3xl font-bold text-red-500">My Orders</h1>
            <CustomizedSelect 
                sx={{ height: 55, maxWidth: '300px' }}
                menu={[{ label: 'All', value: 'All'}, ...Statuses, { label: 'Rated', value: 'Rated'},]}
                icon={<FilterListIcon />}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as string)}
            />
            {orders.length === 0 && <div className="flex flex-col gap-5 items-center p-30">
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
                <Card className="flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-wrap gap-3 items-center">
                             <span className={cn("font-bold px-3 py-2 bg-gray-200 rounded-full", isDark && 'bg-[#313131] text-white')}>{order.order_id}</span>
                             <span className="text-gray-400">Order Date: {formatDateWithWeekday(order.createdAt)}</span>
                        </div>
                        <Status status={order.status} isDark={isDark}/>
                    </div>
                    <OrderItemsContainer orderItems={order.orderItems} />
                    <div className="flex justify-end">
                        <RedButton onClick={() => navigate(`/order/${order._id}`)}>{order.status === 'Completed' ? 'Rate your order' : 'Track Order'}</RedButton>
                    </div>
                </Card>
            ))}
        {orders.length > 0 && <CustomizedPagination count={pagination.totalPages} onChange={handlePage} />}
        </div>
    )
}

export default CustomerOrders