import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import useDarkmode from '../../../../hooks/useDarkmode';
import { formatDate } from "../../../../utils/dateUtils";

export const PurchaseOrdersTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Supplier Name</StyledTableCell>
            <StyledTableCell>Total Items</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
            <StyledTableCell>Order Date</StyledTableCell>
            <StyledTableCell>Received Date</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell align='center'>Action</StyledTableCell>
        </TableRow>
    )
}

export const PurchaseOrderTableRow = ({ purchaseOrder } : { purchaseOrder : PurchaseOrder }) => {
    const isDark = useDarkmode();

    return (
           <StyledTableRow
                isDark={isDark}
            >
                <StyledTableCell isDark={isDark}>{purchaseOrder.supplier.name}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{purchaseOrder.purchase_items.length}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{purchaseOrder.totalAmount}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{formatDate(purchaseOrder.createdAt)}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{!purchaseOrder?.receivedDate ? 'N/A' : formatDate(purchaseOrder.receivedDate)}</StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>{purchaseOrder.status}</StyledTableCell>
            </StyledTableRow>
    )
}