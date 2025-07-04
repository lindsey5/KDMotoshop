import { RedButton } from "../../../components/Button"
import AddIcon from '@mui/icons-material/Add';
import { Pagination } from "@mui/material";
import CustomizedTable from "../../../components/Table";
import { SearchField } from "../../../components/Textfield";
import { CustomizedSelect } from "../../../components/Select";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import type { DateRange } from "@mui/x-date-pickers-pro";
import { CustomDateRangePicker } from "../../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import { OrderTableColumns, OrderTableRow } from "../../../components/tables/OrderTable";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { fetchData } from "../../../services/api";
import { Statuses } from "../../../constants/status";
import { OrderStatsCards } from "../../../components/cards/admin/OrderStatsCard";
import Card from "../../../components/Card";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/orders' },
]

const PaginationState ={
    totalPages: 1,
    page: 1,
    searchTerm: ''
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const [pagination, setPagination] = useState<Pagination>(PaginationState);
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs> | undefined>();
    
    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    const getOrdersAsync = async () => {
        const startDate = selectedDates?.[0] ? new Date(selectedDates[0].toString()) : '';
        const endDate = selectedDates?.[1] ? new Date(selectedDates[1].toString()) : '';

        const response = await fetchData(`/api/order?page=${pagination.page}&status=${selectedStatus}&searchTerm=${searchTerm}&startDate=${startDate}&endDate=${endDate}`);
        if(response.success) {
            setPagination(prev => ({...prev, totalPages: response.totalPages, page: response.page }));
            setOrders(response.orders);
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPagination({...PaginationState, searchTerm });
            setSelectedStatus('All');
            setSelectedDates(undefined);
            getOrdersAsync();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);

    }, [searchTerm]);

    useEffect(() => {
        getOrdersAsync();
    }, [selectedDates, selectedStatus,])

    return <div className="h-full flex flex-col p-5 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="font-bold text-4xl mb-4">Orders List</h1>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>
            <RedButton startIcon={<AddIcon />} onClick={() => navigate('/admin/orders/create')}>Add Order</RedButton>
        </div>
        <OrderStatsCards />
        
        <Card className="flex-grow min-h-[700px] flex flex-col mt-6">
            <div className="flex justify-between items-center mb-6 gap-10">
                <SearchField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value as string)}
                    placeholder="Search by Customer Name, Order ID, Payment Method..." 
                    sx={{ flex: 1, height: 55 }}
                />
                <div className="flex items-center gap-5">
                    <div className="w-[200px]">
                        <CustomizedSelect 
                            sx={{ height: 55 }}
                            menu={[{ label: 'All', value: 'All'}, ...Statuses]}
                            icon={<FilterListIcon />}
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as string)}
                        />
                    </div>
                    <CustomDateRangePicker 
                        value={selectedDates}
                        setValue={setSelectedDates}
                    />
                </div>
            </div>
            <CustomizedTable
                cols={<OrderTableColumns />}
                rows={orders.map(order => <OrderTableRow key={`${order._id}`} order={order} />)} 
            />
            <div className="flex justify-end mt-4">
                <Pagination count={pagination.totalPages} onChange={handlePage} />
            </div>
        </Card>
    </div>
}

export default Orders