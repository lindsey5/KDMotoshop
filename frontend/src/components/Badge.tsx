import { Badge } from "@mui/material";
import type React from "react";

type RedBadgeProps = {
  children: React.ReactNode;
  content: number;
  sx?: object; 
};

const RedBadge = ({ content, children, sx }: RedBadgeProps) => {
  return (
    <Badge
      badgeContent={content}
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: 'red',
          color: 'white',
        },
        ...sx, 
      }}
    >
      {children}
    </Badge>
  );
};

export default RedBadge;
