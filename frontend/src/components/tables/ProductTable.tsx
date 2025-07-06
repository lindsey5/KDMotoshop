import { TableRow, IconButton } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../Table";
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../utils/dateUtils";
import EditIcon from '@mui/icons-material/Edit';
import useDarkmode from "../../hooks/useDarkmode";

export const ProductTableColumns = () => {
  
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="left">Stock</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Product Type</StyledTableCell>
            <StyledTableCell align="center">Created at</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

const highLightLowStock = (product: Product, isDark: boolean): string => {
  if (product.product_type === 'Single') {
    return !product.stock || product.stock < 10
      ? isDark ? 'bg-red-600' : 'bg-red-100'
      : '';
  } else {
    const totalStock = product.variants.reduce((total, v) => total + (v.stock || 0), 0);
    return totalStock < 10
      ? isDark ? 'bg-red-400' : 'bg-red-100'
      : '';
  }
};

export const ProductTableRow = ({ product } : { product : Product }) => {
  const navigate = useNavigate();
  const isDark = useDarkmode();

  return (
    <StyledTableRow isDark={isDark}>
      <StyledTableCell 
        className={highLightLowStock(product, isDark)}
        isDark={isDark}
      >
        <div className="flex items-center gap-2">
          <img 
            className="bg-gray-100 w-12 h-12 object-cover rounded"
            src={
              typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                ? product.thumbnail.imageUrl
                : typeof product.thumbnail === 'string'
                ? product.thumbnail
                : '/photo.png'
            }
            alt="thumbnail"
          />
          <span>{product.product_name}</span>
        </div>
      </StyledTableCell>

      <StyledTableCell 
        className={highLightLowStock(product, isDark)}
        isDark={isDark}
      >
        {product.product_type === 'Single'
          ? product.stock
          : product.variants.reduce((total, variant) => total + (variant.stock || 0), 0)
        }
      </StyledTableCell>

      <StyledTableCell 
        className={highLightLowStock(product, isDark)} 
        align="center"
        isDark={isDark}
      >{product.category}</StyledTableCell>
      <StyledTableCell 
        className={highLightLowStock(product, isDark)} 
        align="center"
        isDark={isDark}
      >{product.product_type}</StyledTableCell>
      <StyledTableCell 
        className={highLightLowStock(product, isDark)} 
        align="center"
        isDark={isDark}
      >{product.createdAt ? formatDate(product.createdAt) : ''}</StyledTableCell>
      <StyledTableCell 
        className={highLightLowStock(product, isDark)} 
        align="center"
        isDark={isDark}
      >
        <IconButton onClick={() => navigate(`/admin/products/product?id=${product._id}`)}>
          <EditIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
        </IconButton>
      </StyledTableCell>
    </StyledTableRow>
    )
}