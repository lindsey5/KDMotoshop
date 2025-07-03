import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from '@mui/material';
import { SidebarLink } from '../SideBar';

const signout = async () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const AdminSidebar = () => {
  return (
    <aside className="w-[200px] fixed left-0 inset-y-0 bg-black p-5 flex flex-col gap-5">
      <img className="h-[80px] mb-8" src="/kd-logo.png" alt="logo" />
      <SidebarLink 
        label="Dashboard" 
        icon={<DashboardIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/dashboard"
      />
      <SidebarLink 
        label="Products" 
        icon={<SportsMotorsportsIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/products"
      />
      <SidebarLink 
        label="Orders" 
        icon={<ShoppingCartIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/orders"
      />
      <SidebarLink 
        label="Employees" 
        icon={<BadgeIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/employees"
      />
      <SidebarLink 
        label="Customers" 
        icon={<PersonIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/customers"
      />
      <SidebarLink 
        label="Settings" 
        icon={<SettingsIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/settings"
      />
      <Button
        onClick={signout}
        fullWidth
        startIcon={<LogoutIcon sx={{ width: 25, height: 25 }} />}
        sx={{
          fontWeight: 'bold',
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'red',
          },
          color: 'white',
          justifyContent: 'flex-start',
          textTransform: 'none',
        }}
      >
        Logout
      </Button>
    </aside>
  );
};
