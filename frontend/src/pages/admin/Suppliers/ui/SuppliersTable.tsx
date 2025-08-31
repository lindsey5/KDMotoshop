import { IconButton, TableRow, Tooltip } from "@mui/material";
import { StyledTableCell, StyledTableRow } from '../../../../components/Table';
import useDarkmode from '../../../../hooks/useDarkmode';
import EditIcon from '@mui/icons-material/Edit';
import SupplierModal from "./SupplierModal";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const SuppliersTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Supplier Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Phone</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell align='center'>Action</StyledTableCell>
        </TableRow>
    )
}

export const SupplierTableRow = ({ supplier } : { supplier : Supplier }) => {
    const isDark = useDarkmode();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [openModal, setOpenModal] = useState<boolean>(supplier._id === id);

    const chipStyle = `px-3 py-1 rounded-full text-xs font-semibold ${
        supplier.status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-gray-200 text-gray-700"
    }`;

    return (
        <>
        <SupplierModal supplier={supplier} close={() => setOpenModal(false)} open={openModal} />
            <StyledTableRow
                isDark={isDark}
            >
                <StyledTableCell isDark={isDark}>{supplier.name}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{supplier.email}</StyledTableCell>
                <StyledTableCell isDark={isDark}>{supplier.phone}</StyledTableCell>
                <StyledTableCell isDark={isDark}>
                    <span className={chipStyle}>
                    {supplier.status}
                    </span>
                </StyledTableCell>
                <StyledTableCell isDark={isDark} align='center'>
                    <Tooltip title="Edit Supplier">
                        <IconButton onClick={() => setOpenModal(true)}>
                            <EditIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
                        </IconButton>
                    </Tooltip>
                </StyledTableCell>
            </StyledTableRow>
        </>
    )
}