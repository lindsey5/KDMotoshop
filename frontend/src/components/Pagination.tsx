import useDarkmode from "../hooks/useDarkmode"
import { Pagination, type PaginationProps } from "@mui/material"

const CustomizedPagination  = ({ sx,  ...props} : PaginationProps) => {
    const isDark = useDarkmode()

    return (
        <Pagination 
            {...props}
            sx={{
                '& .MuiPaginationItem-root': {
                    color: isDark ? 'white' : 'black', 
                },
                '& .Mui-selected': {
                    backgroundColor: 'red', 
                    color: '#fff',
                },
                '& .MuiPaginationItem-previousNext': {
                    color: isDark ? 'white' : '#4b5563',
                },
                '& .MuiPaginationItem-previousNext.Mui-disabled': {
                    color: isDark ? 'white' : '#9ca3af',
                },
                ...sx
            }}
        />
    )
}

export default CustomizedPagination