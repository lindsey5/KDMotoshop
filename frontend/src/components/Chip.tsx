import { Chip, type SxProps, type Theme } from "@mui/material";
import useDarkmode from "../hooks/useDarkmode";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

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

// Map each status to its Chip props
function getStatusConfig(status: OrderItem['status']) {
  switch (status) {
    case "Unfulfilled":
      return {
        color: "warning" as const,
        icon: <ScheduleRoundedIcon fontSize="small" />,
      };
    case "Fulfilled":
      return {
        color: "success" as const,
        icon: <CheckCircleRoundedIcon fontSize="small" />,
      };
    case "Rated":
      return {
        color: "primary" as const,
        icon: <StarRoundedIcon fontSize="small" />,
      };
    case "Cancelled":
      return {
        color: "error" as const,
        icon: <CancelRoundedIcon fontSize="small" />,
    };
    default:
      return {
        color: "default" as const,
        icon: undefined,
      };
  }
}

interface OrderItemStatusChipProps {
  status: OrderItem['status'];
  sx?: SxProps; // optional MUI sx overrides
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
}

export const OrderItemStatusChip = ({
  status,
  sx,
  size = "small",
  variant = "filled",
}: OrderItemStatusChipProps) => {
  const { color, icon } = getStatusConfig(status);
  return (
    <Chip
      icon={icon}
      label={status}
      color={color}
      size={size}
      variant={variant}
      sx={{ fontWeight: 600, letterSpacing: 0.2, ...sx }}
    />
  );
}

function getRefundStatusConfig(status: RefundRequest['status']) {
  switch (status) {
    case "Pending":
      return { color: "warning" as const, icon: <HourglassEmptyRoundedIcon fontSize="small" /> };
    case "Under Review":
      return { color: "info" as const, icon: <SearchRoundedIcon fontSize="small" /> };
    case "Approved":
      return { color: "success" as const, icon: <CheckCircleRoundedIcon fontSize="small" /> };
    case "Rejected":
      return { color: "error" as const, icon: <CancelRoundedIcon fontSize="small" /> };
    case "Processing":
      return { color: "primary" as const, icon: <AutorenewRoundedIcon fontSize="small" /> };
    case "Refunded":
      return { color: "success" as const, icon: <ReplayRoundedIcon fontSize="small" /> };
    default:
      return { color: "default" as const, icon: undefined };
  }
}

interface StatusChipProps {
  status: RefundRequest['status'];
  sx?: SxProps;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
}

export const RefundStatusChip = ({ status, sx, size = "small", variant = "filled" }: StatusChipProps) => {
  const { color, icon } = getRefundStatusConfig(status);
  return <Chip icon={icon} label={status} color={color} size={size} variant={variant} sx={{ fontWeight: 600, letterSpacing: 0.2, ...sx }} />;
}

function getPlatformConfig(platform: Order['order_source']) {
  switch (platform) {
    case "Website":
      return { color: "info" as const, icon: <LanguageRoundedIcon fontSize="small" /> };
    case "Store":
      return { color: "primary" as const, icon: <StorefrontRoundedIcon fontSize="small" /> };
    case "Facebook":
      return { color: "info" as const, icon: <FacebookRoundedIcon fontSize="small" /> };
    case "Shopee":
      return { color: "warning" as const, icon: <ShoppingCartRoundedIcon fontSize="small" /> };
    case "Lazada":
      return { color: "secondary" as const, icon: <LocalMallRoundedIcon fontSize="small" /> };
    case "Tiktok":
      return { color: "default" as const, icon: <MusicNoteRoundedIcon fontSize="small" /> };
    default:
      return { color: "default" as const, icon: undefined };
  }
}

interface PlatformChipProps {
  platform: Order['order_source'];
  sx?: SxProps;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
}

export default function PlatformChip({ platform, sx, size = "small", variant = "filled" }: PlatformChipProps) {
  const { color, icon } = getPlatformConfig(platform);
  return <Chip icon={icon} label={platform} color={color} size={size} variant={variant} sx={{ fontWeight: 600, letterSpacing: 0.2, ...sx }} />;
}