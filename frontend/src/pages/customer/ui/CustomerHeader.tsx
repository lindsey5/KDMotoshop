import { Button, Drawer, IconButton, Link, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RedButton } from "../../../components/buttons/Button";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CustomerDropdownMenu } from "../../../components/Menu";
import { ThemeToggle } from "../../../components/Toggle";
import { HeaderSearchField } from "../../../components/Textfield";
import RedBadge from "../../../components/Badge";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../../features/cart/cartThunks";
import type { AppDispatch, RootState } from "../../../features/store";
import { SocketContext } from "../../../context/socketContext";
import { ClipboardList, HomeIcon, Menu, StoreIcon, X } from "lucide-react";
import { addNotification,  } from "../../../features/notifications/notificationSlice";
import { fetchNotifications } from "../../../features/notifications/notificationThunks";
import useDarkmode from "../../../hooks/useDarkmode";

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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isDark = useDarkmode();

    useEffect(() => {
        dispatch(fetchCart());
        dispatch(fetchNotifications({ user: 'customer', page: 1}));
    }, [dispatch]);

    useEffect(() => {
        if (!socket) return;
    
        socket.on('customerNotification', (notification) => {
            dispatch(addNotification(notification))
        });
    
    }, [socket]);

    return (
        <>
            <header className="z-10 flex gap-5 items-center justify-between fixed top-0 left-0 right-0 px-2 sm:px-5 py-3 bg-black transition-all duration-300">
            <img className="w-20 h-10 lg:w-30 lg:h-15 cursor-pointer" 
                onClick={() => window.location.href = '/'} 
                src="/kd-logo.png" alt="" 
            />
            
            <div className="lg:flex flex-1 justify-center hidden">
                <HeaderSearchField />
            </div>
            <div className="flex gap-1 md:gap-5 items-center">
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
                <CustomerDropdownMenu image={(user?.image as UploadedImage)?.imageUrl}/>
                </>
                }
                <div className="hidden sm:block">
                    <ThemeToggle />
                </div>
                <div className="block sm:hidden">
                    <IconButton
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        sx={{ 
                            color: 'white',
                            ":hover": { color: 'red' }
                        }}
                    >
                        <Menu size={24} />
                    </IconButton>
                </div>
            </div>
        </header>
        <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '280px',
                    backgroundColor: isDark ? '#2a2a2a' : '#ffffff',
                    color: isDark ? 'white' : '',
                    padding: '20px'
                }
            }}
        >
            <div className="flex flex-col h-full">
                {/* Close Button */}
                <div className="flex justify-end mb-6">
                    <IconButton
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        sx={{ color: isDark ? 'white' : '', ":hover": { color: 'red' } }}
                    >
                        <X size={24} />
                    </IconButton>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 mb-6">
                    <Link href="/" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Button
                            fullWidth
                            sx={{ 
                                color: isDark ? 'white' : 'black',
                                justifyContent: 'flex-start',
                                textTransform: 'capitalize',
                                fontSize: '16px',
                                fontWeight: 500,
                                ":hover": { color: 'red' }
                            }}
                            startIcon={<HomeIcon size={20} />}
                        >
                            Home
                        </Button>
                    </Link>
                    <Link href="/products" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <Button
                            fullWidth
                            sx={{ 
                                color: isDark ? 'white' : 'black',
                                justifyContent: 'flex-start',
                                textTransform: 'capitalize',
                                fontSize: '16px',
                                fontWeight: 500,
                                ":hover": { color: 'red' }
                            }}
                            startIcon={<StoreIcon size={20} />}
                        >
                            Products
                        </Button>
                    </Link>
                    
                    {user && user.role === 'Customer' && !loading && (
                        <Link href="/orders" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <Button
                                fullWidth
                                sx={{ 
                                    color: isDark ? 'white' : 'black',
                                    justifyContent: 'flex-start',
                                    textTransform: 'capitalize',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    ":hover": { color: 'red' }
                                }}
                                startIcon={<ClipboardList size={20} />}
                            >
                                My Orders
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Auth Button */}
                {!user && (
                    <div className="mb-6">
                        <RedButton 
                            onClick={() => navigate('/login')}
                            fullWidth
                        >
                            Login
                        </RedButton>
                    </div>
                )}

                {/* Theme Toggle */}
                <div className="mt-auto pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Theme</span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </Drawer>
        </>
    )
}

export default CustomerHeader