import { Avatar, Button, IconButton, Link, Badge } from "@mui/material";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn, formatNumber } from "../../../utils/utils";
import { RedButton } from "../../Button";
import SearchIcon from '@mui/icons-material/Search';
import { fetchData } from "../../../services/api";
import { ProductThumbnail } from "../../image";
import { ThemeToggle } from "../../Toggle";
import useDarkmode from "../../../hooks/useDarkmode";
import { CustomerContext } from "../../../context/CustomerContext";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { SocketContext } from "../../../context/socketContext";

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
    const [products, setProducts] = useState<Product[]>([]);
    const [autoComplete, setAutoComplete] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const isDark = useDarkmode();
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        searchTerm: '',
        totalPages: 1,
    });

    const getProducts = useCallback( async (reset : boolean) => {
        const response = await fetchData(`/api/product?page=${pagination.page}&limit=10&searchTerm=${pagination.searchTerm}`);

        if(response.success) {
            if (!reset && response.products.length === 0) {
                setHasMore(false);
                return;
            }

            const mappedProducts = response.products.map((product : Product) => ({
                    ...product,
                    price: product.product_type === 'Single' ? product.price : product.variants.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0].price
            }))

            if (reset) {
                setProducts(mappedProducts)
                setPagination(prev => ({...prev, page: 1}))
                setHasMore(true);
            }else {
                setProducts(prev => [...prev, ...mappedProducts]);
            }
        }
    }, [pagination.page, pagination.searchTerm])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getProducts(true);
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getProducts(false)
        }, 500); 
        return () => clearTimeout(delayDebounce);
    }, [pagination.page]);

    const handleBlur = () => {
        setTimeout(() => {
            setAutoComplete(false);
        }, 200);
    };

    const lastItemRef = useCallback((node : HTMLDivElement | null) => {
        if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPagination(prev => ({...prev, page: prev.page + 1}))
                }
            });
        if (node) observer.current.observe(node);
        
    },[hasMore]);

    const handleFocus = () => setAutoComplete(true)

    return (
        <div className={cn('flex-1 relative max-w-[500px] relative flex items-center gap-5 px-5 rounded-4xl border-2 border-gray-700 bg-white transition-colors duration-400', isDark && 'bg-[#313131]')}>
            <SearchIcon className={cn(isDark && "text-gray-400")}/>
            <input
              type="text"
              placeholder="Search..."
              className={cn("flex-1 py-2 pr-12 outline-none text-sm md:text-base", isDark && "text-white placeholder-gray-300")}
              onChange={(e) => setPagination(prev => ({ ...prev, searchTerm: e.target.value as string}))}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {autoComplete && pagination.searchTerm && <div className="bg-white max-h-[300px] overflow-y-auto absolute top-[calc(100%+5px)] inset-x-0 z-10 p-3 border border-gray-300 rounded-md">
                {products.length > 0 ? products.map((product, index) => (
                    <div 
                        key={product._id}
                        className="flex gap-5 cursor-pointer hover:bg-gray-100 px-3 py-2"
                        onClick={() => window.location.href = `/product/${product._id}`}
                        ref={index === products.length - 1 ? lastItemRef : null}
                    >
                        <ProductThumbnail 
                            product={product}
                            className="w-15 h-15"
                        />
                        <div>
                             <strong>{product.product_name}</strong>
                            <p className="text-gray-500 mt-2">₱{formatNumber(Number(product.price))}</p>
                        </div>
                    </div>
                )) : <p>No results</p>}
            </div>}
        </div>
    )
}

const CustomerHeader = () => {
    const location = useLocation()
    const [isScrolled, setIsScrolled] = useState<boolean>(location.pathname !== '/');
    const { customer } = useContext(CustomerContext);
    const { socket } = useContext(SocketContext);
    const [carts, setCarts] = useState<Cart[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            const handleAddToCart = (cart: Cart) => {
                console.log(cart)
                const index = carts.findIndex(c => c._id === cart._id );
                console.log(index)
                
                index < 0 ? setCarts(prev => [...prev, cart]) : setCarts(prev => prev
                    .map((c, i) => 
                        i === index ? {...c, quantity: c.quantity + cart.quantity} : c
                    ))
            };

            socket.on('add-to-cart', handleAddToCart);

            return () => {
                socket.off('add-to-cart', handleAddToCart);
            };
        }
    }, [socket, carts]);

    useEffect(() => {
        const getCartsAsync = async () => {
            const response = await fetchData('/api/cart');
            if(response.success) setCarts(response.carts);
        }

        getCartsAsync();
    }, [])

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
                onClick={() => window.location.href = '/'} 
                src="/kd-logo.png" alt="" 
            />
            <HeaderSearchField />
            <div className="flex gap-5 items-center">
                <HeaderLink path="/" label="Home"/>
                <HeaderLink  path="/products" label="Products"/>
                {!customer ?  <RedButton onClick={() => navigate('/login')}>Login</RedButton> :
                <>
                <IconButton sx={{ color: 'white', ":hover": { color: 'red' }}}>
                    <NotificationsOutlinedIcon />
                </IconButton>
                    <Badge badgeContent={carts.length} color="primary">
                        <IconButton  sx={{ color: 'white', ":hover": { color: 'red' } }}>
                            <ShoppingCartOutlinedIcon />
                        </IconButton>
                    </Badge>
                    <Avatar src={customer.image.imageUrl} alt={customer.firstname} />
                </>
                }
                <ThemeToggle />
            </div>
        </header>
    )
}

export default CustomerHeader