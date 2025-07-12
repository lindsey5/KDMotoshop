import { Avatar, Divider, IconButton } from "@mui/material"
import { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import useDarkmode from "../hooks/useDarkmode";
import { cn } from "../utils/utils";
import { signout } from "../services/auth";
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { grey } from "@mui/material/colors";

export const CustomerDropdownMenu = ({ image } : { image: string}) =>{
    const [open, setOpen] = useState<boolean>(false);
    const isDark = useDarkmode();

    const handleClick = () => {
        setOpen(!open);
    };

    return (
            <div className="relative">
            <IconButton onClick={handleClick}>
                <Avatar 
                    className="cursor-pointer"
                    src={image} 
                    alt="profie" 
                />
            </IconButton>
            {open && <div className={cn("text-gray-600 flex flex-col gap-3 px-3 py-5 z-5 top-[calc(100%+8px)] -left-8 transform -translate-x-1/2 absolute bg-white shadow-lg rounded-md", isDark && 'text-white bg-[#313131]')}>
                <div className={cn("z-1 absolute right-3 -top-2 transform -translate-x-1/2 rotate-45 w-5 h-5 bg-white", isDark && 'bg-[#313131]')}></div>
                <li className={cn("z-3 w-[170px] flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-1", isDark && 'hover:bg-[#555555]')}>
                    <ReceiptIcon />
                    My Orders
                </li>
                <li 
                    className={cn("z-3 w-[170px] flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-1", isDark && 'hover:bg-[#555555]')}>
                    <NotificationsOutlinedIcon/>
                    Notifications
                </li>
                <Divider sx={{ borderColor: isDark ? grey[600] : '' }}/>
                <li className={cn("z-3 w-[170px] flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-1", isDark && 'hover:bg-[#555555]')}>
                    <AccountCircleIcon/>
                    Profile
                </li>
                <li 
                    onClick={signout}
                    className={cn("z-3 w-[170px] flex items-center gap-3 cursor-pointer hover:bg-gray-200 px-3 py-1", isDark && 'hover:bg-[#555555]')}>
                    <LogoutIcon/>
                    Sign out
                </li>

            </div>}
            </div>
    )
}