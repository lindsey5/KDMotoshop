import { Chip } from "@mui/material";
import type React from "react";
import useDarkmode from "../hooks/useDarkmode";

type CustomizedChipProps = {
  isSelected: boolean;
  label: string;
  onClick: () => void;
  onDelete?: () => Promise<void>;
}

export const CustomizedChip: React.FC<CustomizedChipProps> = ({
  isSelected,
  label,
  onClick,
  onDelete,
}) => {
  const isDark = useDarkmode();

  return (
    <Chip
      label={label}
      variant="outlined"
      onClick={onClick}
      {...(onDelete && { onDelete })}
      sx={[
        { 
          minWidth: 60, 
          fontSize: 15,
          backgroundColor: isSelected ? 'red' : '',
          color: isDark || isSelected ? 'white' : 'black',
          '& .MuiChip-deleteIcon': {
            color: isDark || isSelected ? 'white' : '', 
          },
          '& .MuiChip-deleteIcon:hover': {
            color: isDark || isSelected ? 'white' : '', 
          },
        }
      ]}
    />
  );
};
