import { RedButton } from "../../components/Button"
import AddIcon from '@mui/icons-material/Add';
import StatCard from "../../components/order/StatCard";
import { Avatar, Pagination, TableRow } from "@mui/material";
import CustomizedTable, { StyledTableCell, StyledTableRow } from "../../components/Table";
import { SearchField } from "../../components/Textfield";
import { CustomizedSelect } from "../../components/Select";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { DateRange } from "@mui/x-date-pickers-pro";
import { CustomDateRangePicker } from "../../components/DatePicker";
import { useNavigate } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import { statusColorMap } from "../../constants/status";
import BreadCrumbs from "../../components/BreadCrumbs";
import { fetchData } from "../../services/api";
import { formatNumber } from "../../utils/utils";
import { Statuses } from "../../constants/contants";
import { formatDate } from "../../utils/dateUtils";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/orders' },
]

export const Status: React.FC<{ status: string}> = ({ status }) => {
  const { bg, icon } = statusColorMap[status] || {
    bg: 'bg-gray-200',
    icon: '#9ca3af',
  };

  return (
    <div className={`flex items-center gap-2 ${bg} p-2 rounded-md`}>
      <CircleIcon sx={{ width: 15, height: 15, color: icon }} />
      <h1 className="font-bold text-gray-600">{status}</h1>
    </div>
  );
};
const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const navigate = useNavigate();
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs>>(() => [
        dayjs().startOf('year'),  // Jan 1st this year
        dayjs().endOf('year'),    // Dec 31st this year
    ]);
    
    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    const getOrdersAsync = async () => {
        const response = await fetchData(`/api/order?page=${pagination.page}&status=${selectedStatus}&searchTerm=${searchTerm}&startDate=${selectedDates[0]?.toISOString()}&endDate=${selectedDates[1]?.toISOString()}`);
        if(response.success) {
            setPagination(prev => ({...prev, totalPages: response.totalPages, page: response.page }));
            setOrders(response.orders);
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getOrdersAsync();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);

    }, [selectedDates, selectedStatus, searchTerm, pagination.page]);


    return <div className="h-full flex flex-col bg-gray-100 p-5">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="font-bold text-4xl mb-4">Orders List</h1>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>
            <RedButton startIcon={<AddIcon />} onClick={() => navigate('/admin/orders/create')}>Add Order</RedButton>
        </div>
        <div className="h-[150px] flex items-center bg-white gap-10 p-5 rounded-lg shadow-md border-1 border-gray-300">
            <StatCard title="Total Orders" value="2,400" subtitle="Total Orders for last 365 days"/>
            <hr className="h-full border-1 border-gray-200" />

            <StatCard title="Pending Orders" value="1,000" subtitle="Total Pending Orders" color="yellow"/>
            <hr className="h-full border-1 border-gray-200" />

            <StatCard title="Completed Orders" value="2,400" subtitle="Completed Orders for last 365 days"/>
            <hr className="h-full border-1 border-gray-200" />

            <StatCard title="Cancelled Orders" value="400" subtitle="Cancelled Orders for last 365 days" color="red"/>
        </div>
        <div className="flex-grow min-h-[700px] flex flex-col bg-white p-5 border-1 border-gray-300 mt-6 rounded-lg shadow-md">
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
                    <Pagination count={pagination.totalPages} onChange={handlePage} />
                </div>
            </div>
            <div className="min-h-0 flex-grow overflow-y-auto">
                <CustomizedTable
                    cols={
                        <TableRow>
                            <StyledTableCell>Customer Name</StyledTableCell>
                            <StyledTableCell>Order ID</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Payment Method</StyledTableCell>
                            <StyledTableCell>Order Date</StyledTableCell>
                             <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                    }
                    rows={orders.map(order => (
                        <StyledTableRow>
                            <StyledTableCell>{order.customer.firstname} {order.customer.lastname} </StyledTableCell>
                            <StyledTableCell>{order.order_id}</StyledTableCell>
                            <StyledTableCell>{formatNumber(order.total)}</StyledTableCell>
                            <StyledTableCell>{order.payment_method}</StyledTableCell>
                            <StyledTableCell>{formatDate(order.createdAt)}</StyledTableCell>
                            <StyledTableCell>
                                <div className="flex">
                                    <Status status={order.status} />
                                </div>
                            </StyledTableCell>
                            <StyledTableCell>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))} 
                />
            </div>
        </div>
    </div>
}

export default Orders