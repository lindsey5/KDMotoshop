import { IconButton, TableRow, Tooltip } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import { formatDate } from '../../../../utils/dateUtils';
import useDarkmode from '../../../../hooks/useDarkmode';
import UserAvatar from "../../../ui/UserAvatar";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatNumber } from "../../../../utils/utils";
import { useState } from "react";
import RefundRequestModal from "./RefundRequestModal";
import { RefundStatusChip } from "../../../../components/Chip";

export const RefundsTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Order ID</StyledTableCell>
            <StyledTableCell>Product Name</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
            <StyledTableCell>Request Date</StyledTableCell>
            <StyledTableCell align='center'>Action</StyledTableCell>
        </TableRow>
    )
}

export const RefundsTableRow = ({ request } : { request: RefundRequest}) => {
    const isDark = useDarkmode();
    const [open ,setOpen] = useState<boolean>(false);

    return (
        <>
        <RefundRequestModal open={open} close={() => setOpen(false)} refundRequest={request}/>
        <StyledTableRow
            isDark={isDark}
        >
            <StyledTableCell isDark={isDark}>
                <div className="flex items-center gap-2">
                    <UserAvatar image={request.customer_id.image.imageUrl}/>
                    {request.customer_id.firstname} {request.customer_id.lastname}
                </div>
            </StyledTableCell>
            <StyledTableCell isDark={isDark}>{request.order_item_id.order_id.order_id}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{request.order_item_id.product_id.product_name}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{request.quantity}</StyledTableCell>
            <StyledTableCell isDark={isDark}><RefundStatusChip status={request.status}/></StyledTableCell>
            <StyledTableCell isDark={isDark}>₱{formatNumber(request.totalAmount)}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{formatDate(request.createdAt)}</StyledTableCell>
            <StyledTableCell isDark={isDark} align='center'>
                <Tooltip title="View" followCursor>
                <IconButton onClick={() => setOpen(true)} sx={{ color: isDark ? 'white' : 'black'}}>
                    <VisibilityIcon />
                </IconButton>
                </Tooltip>
            </StyledTableCell>
        </StyledTableRow>
        </>
    )
}