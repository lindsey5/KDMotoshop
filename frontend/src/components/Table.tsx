import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer, { type TableContainerProps } from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { ReactNode } from 'react';

export const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{isDark?: boolean}>(({ theme, isDark }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: 'white',
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: isDark ? theme.palette.common.white : 'inherit',
  },
}));

export const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{isDark?: boolean}>(({ isDark }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: isDark ? '#313131' : 'white',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: isDark ? ' #252525' : '#eeeeee',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td': {
    borderColor: isDark ? '#4b4b4b' : '',
  },
}));

interface CustomizedTableProps extends TableContainerProps{ 
  cols: ReactNode, 
  rows: ReactNode
}

const CustomizedTable = ({cols, rows, ...props} : CustomizedTableProps) => {
  return (
    <TableContainer component={Paper} {...props}>
      <Table aria-label="customized table">
        <TableHead>
          {cols}
        </TableHead>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CustomizedTable