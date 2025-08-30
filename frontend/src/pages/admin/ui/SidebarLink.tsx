import { Link, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { Badge } from '@mui/material';
import { cn } from '../../../utils/utils';

export type SidebarLinkProps = {
  icon: ReactNode;
  label: string;
  path: string;
  badgeContent?: number;
};

export const SidebarLink = ({ label, icon, path, badgeContent }: SidebarLinkProps) => {
  const pathname = useLocation().pathname;

  return (
    <Badge 
      badgeContent={badgeContent} 
      color="primary"    
      sx={{
        '& .MuiBadge-badge': { right: 10 },
      }}
    >
      <Link
        to={path}
        className={cn(
          'cursor-pointer gap-3 flex items-center w-full text-white font-bold px-2 py-2 rounded transition',
          pathname === path ? 'bg-red-600' : 'hover:bg-gray-700'
        )}
      >
        {icon}
        <span className="flex-1 text-left text-sm">{label}</span>
      </Link>
    </Badge>
  );
};
