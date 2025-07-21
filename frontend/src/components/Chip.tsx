import { Chip, type SxProps, type Theme } from "@mui/material";
import useDarkmode from "../hooks/useDarkmode";

type CustomizedChipProps = {
  isSelected?: boolean;
  label: string;
  onClick?: () => void;
  onDelete?: () => Promise<void>;
  sx?: SxProps<Theme>;
}

export const CustomizedChip = ({
  isSelected,
  label,
  onClick,
  onDelete,
  sx
} : CustomizedChipProps) => {
  const isDark = useDarkmode();

  return (
    <Chip
      label={label}
      variant="outlined"
      {...(onClick && { onClick })}
      {...(onDelete && { onDelete })}
      sx={{ 
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
          ...sx
        }}
    />
  );
};
