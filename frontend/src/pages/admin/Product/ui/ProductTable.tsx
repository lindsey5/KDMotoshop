import { TableRow, IconButton, Tooltip } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../../utils/dateUtils";
import EditIcon from '@mui/icons-material/Edit';
import useDarkmode from "../../../../hooks/useDarkmode";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export const ProductTableColumns = () => {
  
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="left">Stock</StyledTableCell>
            <StyledTableCell align="center">Category</StyledTableCell>
            <StyledTableCell align="center">Product Type</StyledTableCell>
            <StyledTableCell align="center">Created at</StyledTableCell>
            <StyledTableCell align="center">Created by</StyledTableCell>
            <StyledTableCell align="center">Rating</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}

export const ProductTableRow = ({ product } : { product : Product }) => {
  const navigate = useNavigate();
  const isDark = useDarkmode();

  return (
    <StyledTableRow isDark={isDark}>
      <StyledTableCell 
        isDark={isDark}
      >
        <div className="flex items-center gap-2 min-w-[200px]">
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
        isDark={isDark}
      >
        {product.product_type === 'Single'
          ? product.stock
          : product.variants.reduce((total, variant) => total + (variant.stock || 0), 0)
        }
      </StyledTableCell>

      <StyledTableCell 
        align="center"
        isDark={isDark}
      >{product.category}</StyledTableCell>
      <StyledTableCell 
        align="center"
        isDark={isDark}
      >{product.product_type}</StyledTableCell>
      <StyledTableCell 
        align="center"
        isDark={isDark}
      >{product.createdAt ? formatDate(product.createdAt) : ''}</StyledTableCell>
      <StyledTableCell 
        align="center"
        isDark={isDark}
      >{`${product.added_by?.firstname} ${product.added_by?.lastname}`}</StyledTableCell>
      <StyledTableCell 
        align="center"
        isDark={isDark}
      >{product.rating} / 5</StyledTableCell>
      <StyledTableCell 
        align="center"
        isDark={isDark}
      >
        <Tooltip title="Edit Product">
        <IconButton onClick={() => navigate(`/admin/product?id=${product._id}`)}>
          <EditIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
        </IconButton>
        </Tooltip>
        <Tooltip title="View Reviews">
        <IconButton onClick={() => navigate(`/admin/reviews/${product._id}`)}>
          <ThumbUpIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
        </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
    )
}