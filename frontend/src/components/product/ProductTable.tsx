import { TableRow, IconButton } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../Table"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../utils/dateUtils"
import EditIcon from '@mui/icons-material/Edit';

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

export const ProductTableRow = ({ product } : { product : Product }) => {
    const navigate = useNavigate();
    
    return (
        <StyledTableRow>
            <StyledTableCell className={product.stock && product.stock < 10 ? 'bg-red-100' : ''} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img 
                    className="bg-gray-100 w-12 h-12"
                    src={
                        typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                        ? product.thumbnail.imageUrl
                            : typeof product.thumbnail === 'string'
                            ? product.thumbnail
                        : '/photo.png'
                    }
                />
                {product.product_name}
            </StyledTableCell>
            <StyledTableCell className={product.stock && product.stock < 10 ? 'bg-red-100' : ''}>{product.product_type === 'Single' ? product.stock : 
                product.variants.reduce((total, variant) => {
                    return variant.stock ? total + variant.stock : total
                }, 0)}
            </StyledTableCell>
            <StyledTableCell className={product.stock && product.stock < 10 ? 'bg-red-100' : ''} align="center">{product.category}</StyledTableCell>
            <StyledTableCell className={product.stock && product.stock < 10 ? 'bg-red-100' : ''} align="center">{product.product_type}</StyledTableCell>
            <StyledTableCell className={product.stock && product.stock < 10 ? 'bg-red-100' : ''} align="center">{product.createdAt ? formatDate(product.createdAt) : ''}</StyledTableCell>
            <StyledTableCell className={product.stock && product.stock < 10 ? 'bg-red-100' : ''} align="center">
                <IconButton onClick={() => navigate(`/admin/products/product?id=${product._id}`)}>
                    <EditIcon />
                </IconButton>
            </StyledTableCell>
        </StyledTableRow>
    )
}