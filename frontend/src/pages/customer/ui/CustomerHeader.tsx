import { Button, IconButton, Link, Tooltip } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RedButton } from "../../../components/buttons/Button";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CustomerDropdownMenu } from "../../../components/Menu";
import { ThemeToggle } from "../../../components/Toggle";
import { HeaderSearchField } from "../../../components/Textfield";
import RedBadge from "../../../components/Badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../../redux/cart-reducer";
import type { AppDispatch, RootState } from "../../../redux/store";
import { SocketContext } from "../../../context/socketContext";
import { ClipboardList } from "lucide-react";
import { addNotification, fetchNotifications } from "../../../redux/notification-reducer";

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
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const cart = useSelector((state : RootState) => state.cart.cart)
    const { user, loading } = useSelector((state : RootState) => state.user)
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchNotifications('customer'));
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return;
    
        socket.on('customerNotification', (notification) => {
            dispatch(addNotification(notification))
        });
    
    }, [socket]);

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
                {!user && <RedButton onClick={() => navigate('/login')}>Login</RedButton>}
                {user && user.role === 'Customer' && !loading && <>
                <RedBadge content={cart.length}>
                    <Link href="/cart">
                    <Tooltip title="Cart">
                        <IconButton  
                            sx={{ 
                                color: 'white', 
                                ":hover": { color: 'red' } 
                            }}
                        >
                            <ShoppingCartOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    </Link>
                </RedBadge>
                <Link className="hidden md:block" href="/orders">
                    <Tooltip title="My Orders">
                        <IconButton  
                            sx={{ 
                                color: 'white', 
                                ":hover": { color: 'red' } 
                            }}
                        >
                            <ClipboardList size={24} />
                        </IconButton>
                    </Tooltip>
                </Link>
                <CustomerDropdownMenu image={(user?.image as UploadedImage).imageUrl}/>
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