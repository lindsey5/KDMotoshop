import { Button, IconButton } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useState, useEffect } from "react";
import { cn } from "../../utils/utils";

const HeaderLink = ({ label, onClick } : { onClick: () => void, label: string}) => {
    return (
        <Button
            onClick={onClick}
            sx={{ 
                color: 'white',
                textDecoration: 'none',
                fontSize: '18px',
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
    )
}

const CustomerHeader = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id : string) => {
        const section = document.getElementById(id);
        if(section) section.scrollIntoView({
            behavior: 'smooth', 
            block: 'start', 
        })
    }

    return (
        <header className={cn("z-1 flex justify-between items-center fixed top-0 left-0 right-0 px-10 py-3 transition-all duration-300", isScrolled && 'bg-black')}>
            <img className="w-30 h-15 cursor-pointer" 
                onClick={() => location.pathname !== '/' ? window.location.href = '/' : scrollToSection('home')} src="/kd-logo.png" alt="" 
            />
            <div className="flex gap-5 items-center">
                <HeaderLink onClick={() => scrollToSection('home')} label="Home"/>
                <HeaderLink  onClick={() => scrollToSection('products')} label="Products"/>
                <HeaderLink onClick={() => scrollToSection('about')} label="About"/>
                <IconButton>
                    <ShoppingCartIcon sx={{ color: 'white' }} fontSize="large"/>
                </IconButton>
            </div>
        </header>
    )
}

export default CustomerHeader