import { Button, IconButton, Link, Badge } from "@mui/material";
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { cn, formatNumber } from "../../../utils/utils";
import { RedButton } from "../../Button";
import SearchIcon from '@mui/icons-material/Search';
import { fetchData } from "../../../services/api";
import { ProductThumbnail } from "../../image";
import useDarkmode from "../../../hooks/useDarkmode";
import { CustomerContext } from "../../../context/CustomerContext";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { CartContext } from "../../../context/CartContext";
import { CustomerDropdownMenu } from "../../Menu";
import { ThemeToggle } from "../../Toggle";

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

const HeaderSearchField = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [autoComplete, setAutoComplete] = useState<boolean>(false);
    const isDark = useDarkmode();
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        searchTerm: '',
        totalPages: 1,
    });

    const getProducts = async () => {
        const response = await fetchData(`/api/product?page=${pagination.page}&limit=30&searchTerm=${pagination.searchTerm}`);

        if(response.success) {
            const mappedProducts = response.products.map((product : Product) => ({
                    ...product,
                    price: product.product_type === 'Single' ? product.price : product.variants.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0].price
            }))

            setProducts(mappedProducts)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getProducts();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm, pagination.page])

    const handleBlur = () => {
        setTimeout(() => {
            setAutoComplete(false);
        }, 200);
    };

    const handleFocus = () => setAutoComplete(true)

    return (
        <div className={cn('flex flex-1 min-w-[130px] max-w-[500px] items-center gap-5 px-5 rounded-4xl border-2 border-gray-700 bg-white transition-colors duration-400', isDark && 'bg-[#313131]')}>
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
                {products.length > 0 ? products.map((product) => (
                    <div 
                        key={product._id}
                        className="flex gap-5 cursor-pointer hover:bg-gray-100 px-3 py-2"
                        onClick={() => window.location.href = `/product/${product._id}`}
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
    const { customer } = useContext(CustomerContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <header className="z-10 flex gap-5 items-center justify-between fixed top-0 left-0 right-0 px-5 py-3 bg-black transition-all duration-300">
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
                <Badge badgeContent={cart.length} color="primary">
                    <IconButton  
                        onClick={() => navigate('/cart')}
                        sx={{ 
                            color: 'white', 
                            ":hover": { color: 'red' } 
                        }}
                    >
                        <ShoppingCartOutlinedIcon />
                    </IconButton>
                </Badge>
                <CustomerDropdownMenu image={customer.image.imageUrl}/>
                </>
                }
                <ThemeToggle />
            </div>
        </header>
    )
}

export default CustomerHeader