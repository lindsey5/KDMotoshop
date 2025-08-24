import { IconButton, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import { formatDate } from '../../../../utils/dateUtils';
import useDarkmode from '../../../../hooks/useDarkmode';
import UserAvatar from "../../../ui/UserAvatar";
import EditIcon from '@mui/icons-material/Edit';

export const AdminsTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Full name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Phone</StyledTableCell>
            <StyledTableCell>Role</StyledTableCell>
            <StyledTableCell>Created At</StyledTableCell>
            <StyledTableCell align='center'>Action</StyledTableCell>
        </TableRow>
    )
}

export const AdminsTableRow = ({ admin, openModal } : { admin : Admin, openModal : (admin : Admin) => void}) => {
    const isDark = useDarkmode();

    return (
        <StyledTableRow
            isDark={isDark}
        >
            <StyledTableCell isDark={isDark}>
                <div className="flex items-center gap-2">
                    <UserAvatar image={admin.image}/>
                    {admin.firstname} {admin.lastname}
                </div>
            </StyledTableCell>
            <StyledTableCell isDark={isDark}>{admin.email}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{admin.phone ?? 'N/A'}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{admin.role}</StyledTableCell>
            <StyledTableCell isDark={isDark}>{formatDate(admin.createdAt)}</StyledTableCell>
            <StyledTableCell isDark={isDark} align='center'>
                <IconButton onClick={() => openModal(admin)}>
                    <EditIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
                </IconButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}