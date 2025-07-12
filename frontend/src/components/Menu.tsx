import { Avatar, IconButton } from "@mui/material"
import { useState } from "react";

export const CustomerDropdownMenu = ({ image } : { image: string}) =>{
    const [open, setOpen] = useState<boolean>(false);

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
            {open && <div className="-bottom-12 left-1/2 transform -translate-x-1/2 absolute p-5 bg-white shadow-lg rounded-md">
                <div className="absolute left-1/2 -top-1 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-white"></div>

            </div>}
            </div>
    )
}