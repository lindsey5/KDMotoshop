import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Button } from '@mui/material';

type SidebarLinkProps = {
  icon: ReactNode;
  label: string;
  path: string;
};

export const SidebarLink = ({ label, icon, path }: SidebarLinkProps) => {
  const pathname = useLocation().pathname;

  return (
    <Button
      component={Link}
      to={path}
      fullWidth
      startIcon={icon}
      sx={{
        fontWeight: 'bold',
        backgroundColor: pathname.includes(path) ? 'red' : 'black',
        '&:hover': {
          backgroundColor: 'red',
        },
        color: 'white',
        justifyContent: 'flex-start',
      }}
    >
      {label}
    </Button>
  );
};
