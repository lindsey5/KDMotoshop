import { Button, IconButton, Link } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "../../utils/utils";
import { RedButton } from "../Button";
import SearchIcon from '@mui/icons-material/Search';

const HeaderLink = ({ label, path } : { path: string, label: string}) => {
    return (
        <Link href={path}>
            <Button
                sx={{ 
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 500,
                    position: 'relative',
                    textTransform: 'capitalize',
                    '&:hover': {
                        color: 'red',
                        '&::after': {
                            width: '100%'
                        }
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '1px',
                        left: 0,
                        width: 0,
                        height: '2px',
                        backgroundColor: 'red',
                        transition: 'width 0.3s ease'
                    }
                }}
            >
                {label}
            </Button>
        </Link>
    )
}

const HeaderSearchField = () => {
    return (
        <div className={`
            flex-1
            max-w-[400px]
            relative flex items-center gap-5
            px-5
            bg-[#313131] rounded-4xl border-2 border-gray-500
          `}>
            <SearchIcon className="text-gray-300"/>
            <input
              type="text"
              placeholder="Search..."
              className="
                flex-1 py-2 pr-12 text-white placeholder-gray-300
                focus:outline-none
                text-sm md:text-base
              "
            />
        </div>
    )
}

const CustomerHeader = () => {
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState<boolean>(location.pathname !== '/');

    useEffect(() => {
        const handleScroll = () => {
            if(location.pathname === '/') setIsScrolled(window.scrollY > window.innerHeight);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={cn("z-10 flex gap-10 items-center justify-between fixed top-0 left-0 right-0 px-10 py-3 transition-all duration-300", isScrolled && 'bg-black')}>
            <img className="w-30 h-15 cursor-pointer" 
                onClick={() => window.location.href = '/'} src="/kd-logo.png" alt="" 
            />
            <HeaderSearchField />
            <div className="flex gap-5 items-center">
                <HeaderLink path="/" label="Home"/>
                <HeaderLink  path="/products" label="Products"/>
                <RedButton>Login</RedButton>
                <IconButton>
                    <ShoppingCartIcon sx={{ color: 'white' }} fontSize="large"/>
                </IconButton>
            </div>
        </header>
    )
}

export default CustomerHeader