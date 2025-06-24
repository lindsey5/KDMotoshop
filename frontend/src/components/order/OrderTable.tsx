import CircleIcon from '@mui/icons-material/Circle';
import { statusColorMap } from "../../constants/status";
import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../Table';
import { formatNumber } from '../../utils/utils';
import { formatDate } from '../../utils/dateUtils';

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
        <TableRow>
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Payment Method</StyledTableCell>
            <StyledTableCell>Order Date</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
        </TableRow>
    )
}

export const OrderTableRow = ({ order } : { order : Order}) => {
    return (
        <StyledTableRow>
            <StyledTableCell>{order.customer.firstname} {order.customer.lastname} </StyledTableCell>
            <StyledTableCell>{order.order_id}</StyledTableCell>
            <StyledTableCell>₱{formatNumber(order.total)}</StyledTableCell>
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
    )
}