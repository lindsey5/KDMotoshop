import { Avatar, Divider, Drawer, IconButton } from "@mui/material"
import { useContext, useState, } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import useDarkmode from "../hooks/useDarkmode";
import { cn } from "../utils/utils";
import { signout } from "../services/auth";
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./Toggle";
import { CustomerNotificationContext } from "../context/CustomerNotifContext";
import { NotificationsDrawerList } from "./Drawer";
import RedBadge from "./Badge";

export const CustomerDropdownMenu = ({ image } : { image: string}) =>{
    const [open, setOpen] = useState<boolean>(false);
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [showDrawer, setShowDrawer] = useState<boolean>();
    const { unread, updateNotifications } = useContext(CustomerNotificationContext);

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleClick = (path : string) => {
        navigate(path)
        setOpen(false)
    }

    const toggleDrawer =(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      if(!open) updateNotifications()
      setShowDrawer(open)
    };

    return (
        <div className="relative">

            <IconButton onClick={handleOpen}>
                <RedBadge content={unread}>
                    <Avatar 
                        className="cursor-pointer"
                        src={image} 
                        alt="profie" 
                    />
                </RedBadge>
            </IconButton>
           
            <Drawer 
                open={showDrawer} 
                anchor="right"
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                    backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                    },
                }}
            >
                <NotificationsDrawerList />
            </Drawer>
            {open && <div className={cn("w-[200px] text-gray-600 flex flex-col gap-3 px-3 py-5 z-5 top-[calc(100%+8px)] -left-8 transform -translate-x-1/2 absolute bg-white shadow-lg rounded-md", isDark && 'text-white bg-[#313131]')}>
                <div className={cn("z-1 absolute right-3 -top-2 transform -translate-x-1/2 rotate-45 w-5 h-5 bg-white", isDark && 'bg-[#313131]')}></div>
                <li 
                    className={cn("z-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-2", isDark && 'hover:bg-[#555555]')}
                    onClick={() => handleClick('/orders')}
                >
                    <ReceiptIcon />
                    My Orders
                </li>
                <li 
                    className={cn("z-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-2", isDark && 'hover:bg-[#555555]')}
                    onClick={() => setShowDrawer(true)}
                >
                    <NotificationsOutlinedIcon/>
                    <p className="flex gap-2">
                        Notifications
                    {unread !== 0 && <span className="flex justify-center items-center w-6 h-6 rounded-full bg-red-600 text-white">{unread}</span>}
                    </p>
                </li>
                <Divider sx={{ borderColor: isDark ? grey[600] : '' }}/>
                <li className={cn("z-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-2", isDark && 'hover:bg-[#555555]')}>
                    <AccountCircleIcon/>
                    Profile
                </li>
                <li 
                    onClick={signout}
                    className={cn("z-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-2", isDark && 'hover:bg-[#555555]')}>
                    <LogoutIcon/>
                    Sign out
                </li>
                <li className="flex justify-center sm:hidden mt-4"> 
                    <ThemeToggle />
                </li>
            </div>}
        </div>
    )
}