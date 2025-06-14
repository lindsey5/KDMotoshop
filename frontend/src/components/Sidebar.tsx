import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@mui/material';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface SidebarButtonProps {
  icon: ReactNode;
  label: string;
  path: string;
}

const SidebarButton = ({ label, icon, path }: SidebarButtonProps) => {
  const pathname = useLocation().pathname;

  return (
    <Button
        onClick={() => window.location.href = path}
        variant="contained"
        startIcon={icon}
        sx={{
            fontWeight: 'bold',
            backgroundColor: pathname === path ? 'red' : 'black',
            '&:hover': {
            backgroundColor: 'red',
            },
            justifyContent: 'flex-start'
        }}
        >
      {label}
    </Button>
  );
};

export const AdminSidebar = () => {

    return <aside className="w-[200px] fixed left-0 inset-y-0 bg-black p-5 flex flex-col gap-5">
        <img className="h-[80px] mb-8" src="/kd-logo.png" alt="logo" />
        <SidebarButton label="Dashboard" icon={<DashboardIcon sx={{ width: 25, height: 25}}/>} path="/admin"/>
        <SidebarButton label="Products" icon={<SportsMotorsportsIcon sx={{ width: 25, height: 25}}/>} path="/admin/products"/>
        <SidebarButton label="Orders" icon={<ShoppingCartIcon sx={{ width: 25, height: 25}}/>} path="/admin/orders"/>
        <SidebarButton label="Employees" icon={<PersonIcon sx={{ width: 25, height: 25}} />} path="/admin/emoloyees"/>
         <SidebarButton label="Settings" icon={<SettingsIcon sx={{ width: 25, height: 25}} />} path="/admin/settings"/>
    </aside>
}