import { Button, IconButton, Link } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RedButton } from "../../Button";
import { CustomerContext } from "../../../context/CustomerContext";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CartContext } from "../../../context/CartContext";
import { CustomerDropdownMenu } from "../../Menu";
import { ThemeToggle } from "../../Toggle";
import { HeaderSearchField } from "../../Textfield";
import RedBadge from "../../Badge";

const NavLink = ({ label, path } : { path: string, label: string}) => {
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

const CustomerHeader = () => {
    const { customer } = useContext(CustomerContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <header className="z-10 flex gap-5 items-center justify-between fixed top-0 left-0 right-0 px-2 sm:px-5 py-3 bg-black transition-all duration-300">
            <img className="w-20 h-10 lg:w-30 lg:h-15 cursor-pointer" 
                onClick={() => window.location.href = '/'} 
                src="/kd-logo.png" alt="" 
            />
            <HeaderSearchField />
            <div className="flex gap-5 items-center">
                <div className="gap-5 hidden lg:flex">
                    <NavLink path="/" label="Home"/>
                    <NavLink  path="/products" label="Products"/>
                </div>
                {!customer ?  <RedButton onClick={() => navigate('/login')}>Login</RedButton> :
                <>
                <RedBadge content={cart.length}>
                    <IconButton  
                        onClick={() => navigate('/cart')}
                        sx={{ 
                            color: 'white', 
                            ":hover": { color: 'red' } 
                        }}
                    >
                        <ShoppingCartOutlinedIcon />
                    </IconButton>
                    </RedBadge>
                <CustomerDropdownMenu image={customer.image.imageUrl}/>
                </>
                }
                <div className="hidden sm:block">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}

export default CustomerHeader