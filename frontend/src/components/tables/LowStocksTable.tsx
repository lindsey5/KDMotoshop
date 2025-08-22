import { IconButton, TableRow } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "./Table";
import { useNavigate } from "react-router-dom"
import useDarkmode from "../../hooks/useDarkmode";
import VisibilityIcon from '@mui/icons-material/Visibility';

type LowStockProduct = {
    _id: string;
    product_name: string;
    thumbnail: UploadedImage;
    product_type: string;
    sku: string;
    status: "Low Stock" | "In Stock" | "Out of Stock";
    stock: number;
}

export const LowStockTableColumns = () => {
  
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="left">Stock</StyledTableCell>
            <StyledTableCell align="center">SKU</StyledTableCell>
            <StyledTableCell align="center">Product Type</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

export const LowStockTableRow = ({ product } : { product : LowStockProduct }) => {
  const navigate = useNavigate();
  const isDark = useDarkmode();

  const handleNavigate = () => navigate(`/admin/product?id=${product._id}`)

  return (
    <StyledTableRow isDark={isDark}>
      <StyledTableCell 
        isDark={isDark}
      >
        <div className="flex items-center gap-2 min-w-[200px]">
          <img 
            className="bg-gray-100 w-12 h-12 object-cover rounded"
            src={product.thumbnail.imageUrl}
            alt="thumbnail"
          />
          <span>{product.product_name}</span>
        </div>
      </StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">{product.stock}</StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">{product.sku}</StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">{product.product_type}</StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">{product.status}</StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">
        <IconButton onClick={handleNavigate}>
            <VisibilityIcon />
        </IconButton>
      </StyledTableCell>

    </StyledTableRow>
    )
}