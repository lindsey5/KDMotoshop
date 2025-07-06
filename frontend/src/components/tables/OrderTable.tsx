import CircleIcon from '@mui/icons-material/Circle';
import { statusColorMap } from "../../constants/status";
import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../Table';
import { formatNumber } from '../../utils/utils';
import { formatDate } from '../../utils/dateUtils';
import { RedButton } from '../Button';
import { useNavigate } from 'react-router-dom';
import useDarkmode from '../../hooks/useDarkmode';

export const Status: React.FC<{ status: string, isDark: boolean}> = ({ status, isDark }) => {
  const { bg, icon } = statusColorMap[status] || {
    bg: 'bg-gray-200',
    icon: '#9ca3af',
  };

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-md ${
        isDark ? 'bg-transparent' : bg
      }`}
    >
      <CircleIcon sx={{ width: 15, height: 15, color: icon }} />
      <h1
        className="font-bold"
        style={{ color: isDark ? icon : undefined }}
      >
        {status}
      </h1>
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
    const isDark = useDarkmode();

    return (
        <StyledTableRow
            isDark={isDark}
        >
            <StyledTableCell isDark={isDark}>{order.customer.firstname} {order.customer.lastname} </StyledTableCell>
            <StyledTableCell isDark={isDark}>{order.order_id}</StyledTableCell>
            <StyledTableCell isDark={isDark}>₱{formatNumber(order.total)}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{order.payment_method}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{formatDate(order.createdAt)}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{order.order_source}</StyledTableCell>
            <StyledTableCell isDark={isDark} align='center'>
                <div className="flex justify-center">
                    <Status status={order.status} isDark={isDark}/>
                </div>
            </StyledTableCell>
            <StyledTableCell isDark={isDark} align='center'>
                <RedButton onClick={() => navigate(`/admin/orders/${order._id}`)}>Details</RedButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}