
import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from './Table';
import { formatNumber } from '../../utils/utils';
import { formatDate } from '../../utils/dateUtils';
import { RedButton } from '../buttons/Button';
import { useNavigate } from 'react-router-dom';
import useDarkmode from '../../hooks/useDarkmode';
import { Status } from "../text/Text";
import PlatformChip from "../Chip";

export const OrderTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell>Payment Method</StyledTableCell>
            <StyledTableCell>Order Date</StyledTableCell>
            <StyledTableCell>Order Channel</StyledTableCell>
            <StyledTableCell align='center'>Status</StyledTableCell>
            <StyledTableCell align='center'>Action</StyledTableCell>
        </TableRow>
    )
}

export const OrderTableRow = ({ order, index } : { order : Order, index : number}) => {
    const navigate = useNavigate();
    const isDark = useDarkmode();

    return (
        <StyledTableRow
            isDark={isDark}
        >
            <StyledTableCell isDark={isDark}>{index + 1}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{order?.customer?.firstname} {order?.customer?.lastname} </StyledTableCell>
            <StyledTableCell isDark={isDark}>{order.order_id}</StyledTableCell>
            <StyledTableCell isDark={isDark}>₱{formatNumber(order.total)}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{order.payment_method}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{formatDate(order.createdAt)}</StyledTableCell>
            <StyledTableCell isDark={isDark}><PlatformChip platform={order.order_source} /></StyledTableCell>
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