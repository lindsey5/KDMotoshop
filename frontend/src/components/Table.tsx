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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
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
    backgroundColor: isDark ? '#1e1e1e' : 'white',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: isDark ? '#121212' : '#eeeeee',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '& td': {
    border: 0,
  },
}));

interface CustomizedTableProps extends TableContainerProps{ 
  cols: ReactNode, 
  rows: ReactNode
}

const CustomizedTable : React.FC<CustomizedTableProps> = ({cols, rows, ...props}) => {
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