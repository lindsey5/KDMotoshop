import { IconButton, TableRow } from "@mui/material"
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import { useNavigate } from "react-router-dom"
import useDarkmode from "../../../../hooks/useDarkmode";
import VisibilityIcon from '@mui/icons-material/Visibility';

type StockChipProps = {
  status: "Understock" | "Overstock" | "Balanced";
};

const StockChip = ({ status }: StockChipProps) => {
  const getChipClass = () => {
    switch (status) {
      case "Understock":
        return "bg-red-100 text-red-700 border border-red-400";
      case "Overstock":
        return "bg-blue-100 text-blue-700 border border-blue-400";
      case "Balanced":
        return "bg-green-100 text-green-700 border border-green-400";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-400";
    }
  };

  return (
    <div
      className={`min-w-[100px] px-3 py-1 text-sm rounded-full font-medium ${getChipClass()}`}
    >
      {status}
    </div>
  );
};

export const InventoryStatusTableColumns = () => {
  
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell align="left">Product name</StyledTableCell>
            <StyledTableCell align="left">Stock</StyledTableCell>
            <StyledTableCell align="center">SKU</StyledTableCell>
            <StyledTableCell align="center">Product Type</StyledTableCell>
            <StyledTableCell align="center">Reorder Level</StyledTableCell>
            <StyledTableCell align="center">Optimal Stock</StyledTableCell>
            <StyledTableCell align="center">Suggestion</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
    )
}



export const InventoryStatusTableRow = ({ product } : { product : InventoryStatus }) => {
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
      <StyledTableCell isDark={isDark} align="center">{product.reorderLevel}</StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">{product.optimalStockLevel}</StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">
        {product.status === "Overstock"
          ? `Reduce inventory by ${product.amount} units`
          : product.status === "Understock"
          ? `Restock ${product.amount} units`
          : "No action needed"}
      </StyledTableCell>
      <StyledTableCell isDark={isDark} align="center"><StockChip status={product.status}/></StyledTableCell>
      <StyledTableCell isDark={isDark} align="center">
        <IconButton onClick={handleNavigate}>
            <VisibilityIcon sx={{ color: isDark ? 'white' : 'black' }}/>
        </IconButton>
      </StyledTableCell>

    </StyledTableRow>
    )
}