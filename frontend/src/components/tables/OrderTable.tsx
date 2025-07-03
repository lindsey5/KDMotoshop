import CircleIcon from '@mui/icons-material/Circle';
import { statusColorMap } from "../../constants/status";
import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../Table';
import { formatNumber } from '../../utils/utils';
import { formatDate } from '../../utils/dateUtils';
import { RedButton } from '../Button';
import { useNavigate } from 'react-router-dom';

const Status: React.FC<{ status: string}> = ({ status }) => {
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

export const OrderTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Payment Method</StyledTableCell>
            <StyledTableCell>Order Date</StyledTableCell>
            <StyledTableCell>Order Source</StyledTableCell>
            <StyledTableCell align='center'>Status</StyledTableCell>
            <StyledTableCell align='center'>Action</StyledTableCell>
        </TableRow>
    )
}

export const OrderTableRow = ({ order } : { order : Order}) => {
    const navigate = useNavigate();

    return (
        <StyledTableRow>
            <StyledTableCell>{order.customer.firstname} {order.customer.lastname} </StyledTableCell>
            <StyledTableCell>{order.order_id}</StyledTableCell>
            <StyledTableCell>₱{formatNumber(order.total)}</StyledTableCell>
            <StyledTableCell>{order.payment_method}</StyledTableCell>
            <StyledTableCell>{formatDate(order.createdAt)}</StyledTableCell>
            <StyledTableCell>{order.order_source}</StyledTableCell>
            <StyledTableCell align='center'>
                <div className="flex justify-center">
                    <Status status={order.status} />
                </div>
            </StyledTableCell>
            <StyledTableCell align='center'>
                <RedButton onClick={() => navigate(`/admin/orders/${order._id}`)}>Details</RedButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}