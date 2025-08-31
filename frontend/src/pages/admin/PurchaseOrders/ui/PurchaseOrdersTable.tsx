import { IconButton, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import useDarkmode from '../../../../hooks/useDarkmode';
import { formatDate } from "../../../../utils/dateUtils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { POStatusChip } from "../../../../components/Chip";

export const PurchaseOrdersTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>PO ID</StyledTableCell>
            <StyledTableCell>Supplier Name</StyledTableCell>
            <StyledTableCell align='center'>Total Items</StyledTableCell>
            <StyledTableCell align='center'>Total Amount</StyledTableCell>
            <StyledTableCell align='center'>Order Date</StyledTableCell>
            <StyledTableCell align='center'>Received Date</StyledTableCell>
            <StyledTableCell align='center'>Status</StyledTableCell>
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
                <StyledTableCell isDark={isDark}>{purchaseOrder.po_id}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{purchaseOrder.supplier.name}</StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>{purchaseOrder.purchase_items?.length}</StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>{purchaseOrder.totalAmount}</StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>{formatDate(purchaseOrder.createdAt)}</StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>{!purchaseOrder?.receivedDate ? 'N/A' : formatDate(purchaseOrder.receivedDate)}</StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'><POStatusChip status={purchaseOrder.status}/></StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>
                    <IconButton onClick={() => window.location.href = `/admin/purchase-order/${purchaseOrder._id}`}>
                        <VisibilityIcon />
                    </IconButton>
                </StyledTableCell>
            </StyledTableRow>
    )
}