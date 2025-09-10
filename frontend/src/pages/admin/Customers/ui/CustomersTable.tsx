import { TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import useDarkmode from '../../../../hooks/useDarkmode';
import UserAvatar from "../../../ui/UserAvatar";
import { formatDate, isWithinLast7Days } from "../../../../utils/dateUtils";


export const CustomersTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Fullname</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Last Order</StyledTableCell>
            <StyledTableCell align="center">Total Orders</StyledTableCell>
        </TableRow>
    )
}

export const CustomersTableRow = ({ customer } : { customer: Customer}) => {
    const isDark = useDarkmode();

    return (
        <StyledTableRow
            isDark={isDark}
        >
            <StyledTableCell isDark={isDark}>
                <div className="flex items-center gap-2">
                <UserAvatar image={customer.image} />
                <p>{customer.firstname} {customer.lastname}</p>

                {isWithinLast7Days(customer?.createdAt) && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">New</span>
                )}
                </div>
            </StyledTableCell>
            <StyledTableCell isDark={isDark}>{customer.email}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{customer?.lastOrder ? formatDate(customer.lastOrder) : 'N/A'}</StyledTableCell>
            <StyledTableCell isDark={isDark} align="center">{customer?.totalOrders}</StyledTableCell>
        </StyledTableRow>
    )
}