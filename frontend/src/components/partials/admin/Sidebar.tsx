import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Badge, Button, Divider } from '@mui/material';
import { SidebarLink } from './SidebarLink';
import { ThemeToggle } from '../../Toggle';
import { useContext } from 'react';
import { AdminNotificationContext } from '../../../context/AdminNotificationContext';
import HistoryIcon from '@mui/icons-material/History';
import { AdminContext } from '../../../context/AdminContext';

const signout = async () => {
  localStorage.removeItem('token');
  window.location.href = '/admin/login';
};

const NotificationLink = () => {
  const { unread } = useContext(AdminNotificationContext);

  return (
    <Badge badgeContent={unread} color='primary'>
      <SidebarLink 
        label="Notifications" 
        icon={<NotificationsRoundedIcon sx={{ width: 25, height: 25 }} />} 
        path="/admin/notifications"
      />
    </Badge>
  )
}

export const AdminSidebar = () => {
  const { admin } = useContext(AdminContext);

  return (
    <aside className="w-[200px] fixed left-0 inset-y-0 p-5 flex flex-col items-center gap-5 bg-[#2A2A2A]">
      <img className="h-[80px] mb-8" src="/kd-logo.png" alt="logo" />
      <div className='w-full flex-col flex gap-3 flex-1'>
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
          label="Customers" 
          icon={<PersonIcon sx={{ width: 25, height: 25 }} />} 
          path="/admin/customers"
        />
        {admin?.role === 'Super Admin' && <SidebarLink 
          label="Admins" 
          icon={<BadgeIcon sx={{ width: 25, height: 25 }} />} 
          path="/admin/admins"
        />}
        <Divider sx={{ backgroundColor: '#9CA3AF' }}/>
        <NotificationLink />
        {admin?.role === 'Super Admin' && <SidebarLink 
          label="Activity Logs" 
          icon={<HistoryIcon sx={{ width: 25, height: 25 }} />} 
          path="/admin/activities"
        />}
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
            backgroundColor: '#1e1e1e]',
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
      </div>
      <ThemeToggle />
    </aside>
  );
};
