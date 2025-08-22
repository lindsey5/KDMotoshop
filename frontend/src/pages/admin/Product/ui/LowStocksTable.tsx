import { IconButton, TableRow } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { useNavigate } from "react-router-dom"
import useDarkmode from "../../../../hooks/useDarkmode";
import VisibilityIcon from '@mui/icons-material/Visibility';

interface StockChipProps {
  status: "Low Stock" | "In Stock" | "Out of Stock";
}

const StockChip = ({ status }: StockChipProps) => {
  const getChipClass = () => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700 border border-green-400";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700 border border-yellow-400";
      case "Out of Stock":
        return "bg-red-100 text-red-700 border border-red-400";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-400";
    }
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getChipClass()}`}>
      {status}
    </span>
  );
};

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
      <StyledTableCell isDark={isDark} align="center"><StockChip status={product.status}/></StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">
        <IconButton onClick={handleNavigate}>
            <VisibilityIcon sx={{ color: isDark ? 'white' : 'black' }}/>
        </IconButton>
      </StyledTableCell>

    </StyledTableRow>
    )
}