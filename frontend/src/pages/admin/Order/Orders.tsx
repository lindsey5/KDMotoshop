import { RedButton } from "../../../components/buttons/Button"
import AddIcon from '@mui/icons-material/Add';
import CustomizedTable from "../../../components/Table";
import { SearchField } from "../../../components/Textfield";
import { CustomizedSelect, StatusSelect } from "../../../components/Select";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import type { DateRange } from "@mui/x-date-pickers-pro";
import { CustomDateRangePicker } from "../../../components/DatePicker";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { Statuses } from "../../../constants/status";
import { OrderStatsCards } from "./ui/OrderStatsCard";
import Card from "../../../components/Card";
import CustomizedPagination from "../../../components/Pagination";
import { Status, Title } from "../../../components/text/Text";
import PageContainer from "../ui/PageContainer";
import { Button } from "@mui/material";
import { exportData, formatNumberToPeso } from "../../../utils/utils";
import useFetch from "../../../hooks/useFetch";
import { useDebounce } from "../../../hooks/useDebounce";
import { formatDate } from "../../../utils/dateUtils";
import PlatformChip from "../../../components/Chip";
import useDarkmode from "../../../hooks/useDarkmode";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/ovrders' },
]

const payment_methods = ["All", "CASH", "GCASH", "PAYMAYA", "CARD"]

const OrderRow = (index : number, order : Order, isDark : boolean, navigate : NavigateFunction) => {
    return {
        '#' : index + 1,
        'Customer Name' : `${order.customer.firstname} ${order.customer.lastname}`,
        'Order ID' : order.order_id,
        'Amount' : formatNumberToPeso(order.total),
        'Payment Method' : order.payment_method,
        'Order Date' : formatDate(order.createdAt),
        'Order Channel' : <PlatformChip platform={order.order_source} />,
        'Status' : <div className="flex justify-center">
            <Status status={order.status} isDark={isDark}/>
        </div>,
        'Action' : <RedButton onClick={() => navigate(`/admin/orders/${order._id}`)}>Details</RedButton>
    }
}

const Orders = () => {
    const isDark = useDarkmode();
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [paymentMethod, setPaymentMethod] = useState<string>('All');
    const navigate = useNavigate();
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs> | undefined>();
    const [from, setFrom] = useState<string>('Website');
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const searchDebounce = useDebounce(searchTerm, 500);
    
    const formattedSelectedDates = useMemo(() => {
        const startDate = selectedDates?.[0] ? selectedDates[0].toString() : '';
        const endDate = selectedDates?.[1] ? selectedDates[1].toString() : '';

        return { startDate, endDate }
    }, [selectedDates])
    
    const { data } = useFetch(`/api/orders?page=${page}&limit=50&status=${selectedStatus}&searchTerm=${searchDebounce}&startDate=${formattedSelectedDates.startDate}&endDate=${formattedSelectedDates.endDate}&payment_method=${paymentMethod}&from=${from}`)
 
    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    useEffect(() => {
        setSelectedStatus('All');
        setSelectedDates(undefined);
    }, [searchDebounce]);

    const exportOrders = () => {
        const dataToExport : any[] = []
        data?.orders.forEach((order : Order) => {
            order.orderItems?.forEach(item => {
                dataToExport.push({
                    order_id: order.order_id,
                    order_date: order.createdAt,
                    status: order.status,
                    customer: `${order.customer.firstname} ${order.customer.lastname}`,
                    order_channel: order.order_source,
                    sku: item.sku,
                    product_name: item.product_name,
                    price: item.price,
                    quantity: item.quantity,
                    amount: item.lineTotal,
                })
            })
        })

        exportData({ dataToExport, filename: 'KD Motoshop - Orders.xlsx', sheetname: 'Orders'})
    }

    const cols = useMemo(() => ['#', 'Customer Name', 'Order ID', 'Amount', 'Payment Method', 'Order Date', 'Order Channel', 'Status', 'Action'], [])
    const rows = useMemo(() => data?.orders.map((order : Order, index : number) => OrderRow(index, order, isDark, navigate)) || [], [data?.orders]);


    return <PageContainer className="flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <div>
                <Title className="mb-4">Orders</Title>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>
            <div className="flex items-center gap-5">
                <Button variant="contained" onClick={exportOrders}>Export</Button>
                <RedButton startIcon={<AddIcon />} onClick={() => navigate('/admin/orders/create')}>Add Order</RedButton>
            </div>
        </div>
        <OrderStatsCards />
        
        <Card className="h-screen flex flex-col mt-6">
            <div className="flex flex-col md:flex-row md:flex-wrap justify-between mb-6 gap-10">
                <SearchField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Customer Name, Order ID" 
                    sx={{ flex: 1, maxWidth: '400px', height: 55 }}
                />
                <div className="flex-1 flex md:flex-row flex-col gap-5">
                    <div className="flex-1 flex gap-10">
                        <CustomizedSelect
                            label="Order Channel"
                            value={from}
                            onChange={(e) => setFrom(e.target.value as string)}
                            menu={['Website', 'Store', 'Facebook', 'Shopee', 'Lazada', 'Tiktok'].map(method => ({ value: method, label: method }))}
                         />
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
                cols={cols}
                rows={rows} 
            />
            <div className="flex justify-end mt-4">
                <CustomizedPagination count={data?.totalPages} page={page} onChange={handlePage} />
            </div>
        </Card>
    </PageContainer>
}

export default Orders