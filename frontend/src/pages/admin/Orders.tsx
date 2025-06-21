import { RedButton } from "../../components/Button"
import AddIcon from '@mui/icons-material/Add';
import StatCard from "../../components/order/StatCard";
import { Pagination, TableRow } from "@mui/material";
import CustomizedTable, { StyledTableCell } from "../../components/Table";
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

const StatusMenu : Menu [] = [
    { label: 'All', value: 'All'},
    { label: 'Pending', value: 'Pending' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Refunded', value: 'Cancelled' },
]

const statusColorMap: Record<string, { bg: string; icon: string }> = {
  Pending: { bg: 'bg-yellow-100', icon: '#eab308' },
  Accepted: { bg: 'bg-blue-200', icon: '#3b82f6' },
  Shipped: { bg: 'bg-purple-200', icon: '#a855f7' },
  Completed: { bg: 'bg-green-200', icon: '#22c55e' },
  Rejected: { bg: 'bg-red-200', icon: '#ef4444' },
  Cancelled: { bg: 'bg-gray-200', icon: '#9ca3af' },
  Refunded: { bg: 'bg-gray-200', icon: '#9ca3af' },
};

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

    useEffect(() => {
        const delayDebounce = setTimeout(() => {

        }, 300); 
        
        return () => clearTimeout(delayDebounce);

    }, [selectedDates, selectedStatus])


    return <div className="h-full flex flex-col bg-gray-100 p-5">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="font-bold text-4xl">Orders List</h1>
                <p className="text-gray-600 mt-2">Here you can find all your orders</p>
            </div>
            <RedButton startIcon={<AddIcon />} onClick={() => navigate('/admin/order/create')}>Add Order</RedButton>
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
            <div className="flex justify-between items-center mb-6">
                <SearchField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value as string)}
                    placeholder="Search by Name, Order ID..." 
                    sx={{ maxWidth: 350, height: 55 }}
                />
                <div className="flex items-center gap-5">
                    <div className="w-[200px]">
                        <CustomizedSelect 
                            sx={{ height: 55 }}
                            menu={StatusMenu}
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
                    rows={<></>} 
                />
            </div>
        </div>
    </div>
}

export default Orders

/*

<StyledTableRow>
                            <StyledTableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar alt="Remy Sharp" src="/476294607_122154152066335669_8446185650913317282_n.jpg" />
                                Lindsey Samson
                            </StyledTableCell>
                            <StyledTableCell>#Order-10004</StyledTableCell>
                            <StyledTableCell>₱ 5,000</StyledTableCell>
                            <StyledTableCell>Cash on Delivery</StyledTableCell>
                            <StyledTableCell>June 20, 2025</StyledTableCell>
                            <StyledTableCell>
                                <div className="flex items-center">
                                    <Status status={status.label}/>
                                </div>
                            </StyledTableCell>
                            <StyledTableCell>
                                <Button variant="outlined" sx={{ color: 'black', borderColor: 'black'}}>
                                    Details
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
*/