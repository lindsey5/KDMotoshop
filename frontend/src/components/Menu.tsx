import { Avatar, Drawer, IconButton } from "@mui/material"
import { useState, } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import useDarkmode from "../hooks/useDarkmode";
import { cn } from "../utils/utils";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./Toggle";
import { NotificationsDrawerList } from "./Drawer";
import RedBadge from "./Badge";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../features/store";
import { resetNotifications } from "../features/notifications/notificationSlice"
import { updateAllNotifications } from "../features/notifications/notificationThunks";
import { clearCart } from "../features/cart/cartSlice";
import { logoutUser } from "../features/user/userThunks";
import { ClipboardList } from "lucide-react";
import { successAlert } from "../utils/swal";

export const CustomerDropdownMenu = ({ image } : { image: string}) =>{
    const [open, setOpen] = useState<boolean>(false);
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [showDrawer, setShowDrawer] = useState<boolean>();
    const { unread } = useSelector((state : RootState) => state.notification)
    const dispatch = useDispatch<AppDispatch>();

    const handleOpen = () => {
        setOpen(!open);
    };

    const toggleDrawer =(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        console.log(open)
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      if(!open) dispatch(updateAllNotifications('customer'))
      setShowDrawer(open)
    };

    const handleSignout = async () => {
        await successAlert('Logout successful', 'You’ve been securely signed out of your account.')
        dispatch(clearCart())
        dispatch(resetNotifications())   
        dispatch(logoutUser({ path: '/' }))
    }

    const handleClick = (path : string) => {
        navigate(path)
        setOpen(false)
    }

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
                <NotificationsDrawerList close={() => setShowDrawer(false)} />
            </Drawer>
            {open && <div className={cn("w-[200px] text-gray-600 flex flex-col gap-3 px-3 py-5 z-5 top-[calc(100%+8px)] -left-8 transform -translate-x-1/2 absolute bg-white shadow-lg rounded-md", isDark && 'text-white bg-[#313131]')}>
                <div className={cn("z-1 absolute right-3 -top-2 transform -translate-x-1/2 rotate-45 w-5 h-5 bg-white", isDark && 'bg-[#313131]')}></div>
                <li 
                    className={cn("md:hidden block z-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-2", isDark && 'hover:bg-[#555555]')}
                    onClick={() => handleClick('/orders')}
                >
                    <ClipboardList size={24} />
                    My Orders
                </li>
                <li 
                    className={cn("z-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-2", isDark && 'hover:bg-[#555555]')}
                    onClick={() => handleClick('/profile')}
                >
                    <AccountCircleIcon/>
                    Profile
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
                <li 
                    onClick={handleSignout}
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