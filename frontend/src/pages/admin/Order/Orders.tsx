import { RedButton } from "../../../components/buttons/Button"
import AddIcon from '@mui/icons-material/Add';
import CustomizedTable from "../../../components/tables/Table";
import { SearchField } from "../../../components/Textfield";
import { CustomizedSelect, StatusSelect } from "../../../components/Select";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useCallback, useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import type { DateRange } from "@mui/x-date-pickers-pro";
import { CustomDateRangePicker } from "../../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import { OrderTableColumns, OrderTableRow } from "../../../components/tables/OrderTable";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { fetchData } from "../../../services/api";
import { Statuses } from "../../../constants/status";
import { OrderStatsCards } from "../../../components/cards/admin/OrderStatsCard";
import Card from "../../../components/cards/Card";
import CustomizedPagination from "../../../components/Pagination";
import { Title } from "../../../components/text/Text";
import PageContainer from "../../../components/containers/admin/PageContainer";
import usePagination from "../../../hooks/usePagination";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/ovrders' },
]

const payment_methods = ["All", "CASH", "GCASH", "PAYMAYA", "CARD"]

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('All');
    const navigate = useNavigate();
    const { pagination, setPagination } = usePagination();
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs> | undefined>();
 
    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    const getOrdersAsync = useCallback(async () => {
        const startDate = selectedDates?.[0] ? selectedDates[0].toString() : '';
        const endDate = selectedDates?.[1] ? selectedDates[1].toString() : '';

        const response = await fetchData(
            `/api/order?page=${pagination.page}&limit=50&status=${selectedStatus}&searchTerm=${searchTerm}&startDate=${startDate}&endDate=${endDate}&payment_method=${paymentMethod}`
        );

        if (response.success) {
            setPagination(prev => ({ ...prev, totalPages: response.totalPages }));
            setOrders(response.orders);
        }
    }, [selectedDates, selectedStatus, pagination.page, paymentMethod, searchTerm]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPagination(prev => ({...prev, searchTerm }));
            setSelectedStatus('All');
            setSelectedDates(undefined);
            getOrdersAsync();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    useEffect(() => {
        getOrdersAsync();
    }, [selectedDates, selectedStatus, pagination.page, paymentMethod])


    return <PageContainer className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div>
                <Title className="mb-4">Orders</Title>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>
            <RedButton startIcon={<AddIcon />} onClick={() => navigate('/admin/orders/create')}>Add Order</RedButton>
        </div>
        <OrderStatsCards />
        
        <Card className="h-screen flex flex-col mt-6">
            <div className="flex flex-wrap justify-between mb-6 gap-10">
                <SearchField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value as string)}
                    placeholder="Search by Customer Name, Order ID, Order Source" 
                    sx={{ flex: 1, height: 55 }}
                />
                <div className="flex flex-wrap gap-5 justify-end">
                    <div className="w-full xl:w-[400px] flex gap-10">
                        <StatusSelect 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as string)}
                            menu={Statuses}
                        />
                        <CustomizedSelect 
                            sx={{ height: 55 }}
                            label="Payment Method"
                            menu={payment_methods.map(pm => ({ label: pm, value: pm}))}
                            icon={<FilterListIcon />}
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as string)}
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
                rows={orders.map((order, index) => <OrderTableRow key={`${order._id}`} index={index} order={order} />)} 
            />
            <div className="flex justify-end mt-4">
                <CustomizedPagination count={pagination.totalPages} onChange={handlePage} />
            </div>
        </Card>
    </PageContainer>
}

export default Orders