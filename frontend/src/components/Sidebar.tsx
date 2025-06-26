import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button } from '@mui/material';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

type SidebarButtonProps = {
  icon: ReactNode;
  label: string;
  path?: string;
  onClick: () => void;
}

const SidebarButton = ({ label, icon, path, onClick }: SidebarButtonProps) => {
  const pathname = useLocation().pathname;

  return (
    <Button
        onClick={onClick}
        variant="contained"
        startIcon={icon}
        sx={{
            fontWeight: 'bold',
            backgroundColor: path && pathname.includes(path) ? 'red' : 'black',
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

const signout = async () => {
      localStorage.removeItem('token')
      window.location.href = '/login';
}

export const AdminSidebar = () => {
    const navigate = useNavigate();

    return <aside className="w-[200px] fixed left-0 inset-y-0 bg-black p-5 flex flex-col gap-5">
        <img className="h-[80px] mb-8" src="/kd-logo.png" alt="logo" />
        <SidebarButton 
          label="Dashboard" 
          icon={<DashboardIcon sx={{ width: 25, height: 25}}/>} 
          path="/admin/dashboard"
          onClick={() => navigate('/admin/dashboard')}
        />
        <SidebarButton 
          label="Products" 
          icon={<SportsMotorsportsIcon sx={{ width: 25, height: 25}}/>} 
          path="/admin/products"
          onClick={() => navigate('/admin/products')}
        />
        <SidebarButton 
          label="Orders" 
          icon={<ShoppingCartIcon sx={{ width: 25, height: 25}}/>}
          path="/admin/orders"
          onClick={() => navigate('/admin/orders')}
        />
        <SidebarButton 
          label="Employees" 
          icon={<BadgeIcon sx={{ width: 25, height: 25}} />} 
          path="/admin/emoloyees"
          onClick={() => navigate('/admin/employees')}
        />
        <SidebarButton 
          label="Customers" 
          icon={<PersonIcon sx={{ width: 25, height: 25}} />} 
          path="/admin/customers"
          onClick={() => navigate('/admin/customers')}
        />
        <SidebarButton 
          label="Settings" 
          icon={<SettingsIcon sx={{ width: 25, height: 25}} />}
          path="/admin/settings"
          onClick={() => navigate('/admin/settings')}
        />
        <SidebarButton 
          label="Logout" 
          icon={<LogoutIcon sx={{ width: 25, height: 25}} />} 
          onClick={signout}
        />
    </aside>
}