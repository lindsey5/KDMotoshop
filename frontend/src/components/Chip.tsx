import { Chip } from "@mui/material";
import type React from "react";

interface CustomizedChipProps {
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
  return (
    <Chip
      label={label}
      onClick={onClick}
      {...(onDelete && { onDelete })}
      sx={[
        isSelected && {
          backgroundColor: 'red',
          color: 'white',
          '& .MuiChip-deleteIcon': {
            color: 'white', 
          },
          '& .MuiChip-deleteIcon:hover': {
            color: 'white', 
          },
        },
        { minWidth: 60, fontSize: 15 }
      ]}
    />
  );
};
