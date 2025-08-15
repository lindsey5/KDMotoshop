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
import { useContext, useEffect, useState } from 'react';
import HistoryIcon from '@mui/icons-material/History';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { addNotification, fetchNotifications, resetNotifications } from '../../../redux/notification-reducer';
import { SocketContext } from '../../../context/socketContext';
import { logoutUser } from '../../../redux/user-reducer';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";


const NotificationLink = () => {
  const { unread } = useSelector((state : RootState) => state.notification)
  
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
  const { user } = useSelector((state: RootState) => state.user);
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications('admin'));
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on('adminNotification', (notification) => {
      dispatch(addNotification(notification));
    });
  }, [socket]);

  const handleSignout = () => {
    dispatch(resetNotifications());
    dispatch(logoutUser({ navigate, path: '/admin/login' }));
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed bottom-4 left-4 z-50 p-2 bg-gray-800 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <CloseIcon sx={{ color: 'white' }} />
        ) : (
          <MenuIcon sx={{ color: 'white' }} />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#2A2A2A] p-5 flex flex-col items-center gap-5 transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:w-[200px] w-[200px]`}
      >
        <img className="h-[80px] mb-8" src="/kd-logo.png" alt="logo" />
        <div className="w-full flex-col flex gap-3 flex-1">
          <SidebarLink label="Dashboard" icon={<DashboardIcon sx={{ width: 25, height: 25 }} />} path="/admin/dashboard" />
          <SidebarLink label="Products" icon={<SportsMotorsportsIcon sx={{ width: 25, height: 25 }} />} path="/admin/products" />
          <SidebarLink label="Orders" icon={<ShoppingCartIcon sx={{ width: 25, height: 25 }} />} path="/admin/orders" />
          <SidebarLink label="Refunds" icon={<ReplayRoundedIcon sx={{ width: 25, height: 25 }} />} path="/admin/refunds" />
          <SidebarLink label="Customers" icon={<PersonIcon sx={{ width: 25, height: 25 }} />} path="/admin/customers" />
          {user?.role === 'Super Admin' && (
            <SidebarLink label="Admins" icon={<BadgeIcon sx={{ width: 25, height: 25 }} />} path="/admin/admins" />
          )}
          <Divider sx={{ backgroundColor: '#9CA3AF' }} />
          <NotificationLink />
          {user?.role === 'Super Admin' && (
            <SidebarLink label="Activity Logs" icon={<HistoryIcon sx={{ width: 25, height: 25 }} />} path="/admin/activities" />
          )}
          <SidebarLink label="Settings" icon={<SettingsIcon sx={{ width: 25, height: 25 }} />} path="/admin/settings" />
          <Button
            onClick={handleSignout}
            fullWidth
            startIcon={<LogoutIcon sx={{ width: 25, height: 25 }} />}
            sx={{
              fontWeight: 'bold',
              backgroundColor: '#2A2A2A',
              '&:hover': { backgroundColor: 'red' },
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
    </>
  );
};