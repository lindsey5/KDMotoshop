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
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Last Order</StyledTableCell>
            <StyledTableCell align="center">Pending Orders</StyledTableCell>
            <StyledTableCell align="center">Completed Orders</StyledTableCell>
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
             <StyledTableCell isDark={isDark}><StatusChip online={customer?.isOnline ?? false}/></StyledTableCell>
            <StyledTableCell isDark={isDark}>{customer?.lastOrder ? formatDate(customer.lastOrder) : 'N/A'}</StyledTableCell>
            <StyledTableCell isDark={isDark} align="center">{customer?.pendingOrders}</StyledTableCell>
            <StyledTableCell isDark={isDark} align="center">{customer?.completedOrders}</StyledTableCell>
        </StyledTableRow>
    )
}

const StatusChip = ({ online } : { online : boolean }) => {
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
        online
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-gray-100 text-gray-600 border border-gray-300"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full mr-2 ${
          online ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {online ? "Online" : "Offline"}
    </div>
  );
};
