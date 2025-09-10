import {  useEffect, useState } from "react"
import { fetchData } from "../../../services/api"
import BreadCrumbs from "../../../components/BreadCrumbs";
import CustomerProductContainer from "./ui/CustomerProductContainer";
import { CircularProgress, Slider } from "@mui/material";
import { CustomizedSelect } from "../../../components/Select";
import { RedButton } from "../../../components/buttons/Button";
import { getProducts } from "../../../services/productService";
import TopProductsContainer from "../../ui/TopProductContainer";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import CustomizedPagination from "../../../components/Pagination";
import usePagination from "../../../hooks/usePagination";
import { Title } from "../../../components/text/Text";
import { useSelector } from "react-redux";
import type { RootState } from "../../../features/store";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products'}
]

const options = [
    { label: 'A-Z', value: 'a-z' },
    { label: 'Rating high to low', value: 'ratingDesc' },
    { label: 'Rating low to high', value: 'ratingAsc' },
    { label: 'Newest', value: 'newest' },
    { label: 'Oldest', value: 'oldest' }
];

const CustomerProducts = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const searchTerm = searchParams.get('search');
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(category || 'All');
    const [selectedSort, setSelectedSort] = useState<string>(options[0].value);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const isDark = useDarkmode();
    const { pagination, setPagination } = usePagination();
    const [value, setValue] = useState<number[]>([0, 10000]);
    const [loading, setLoading] = useState<boolean>(true);
    const minDistance = 1000;
    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)
    
    const marks = [
        { value: 0, label: '₱0' },
        { value: 10000, label: '₱10000' }
    ];

    const handleSlider = (_: Event, newValue: number[], activeThumb: number) => {
        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
        }
    };

    const getCategories = async () => {
        const response = await fetchData('/api/categories')
        if(response.success) setCategories(response.categories)
    }

    const getTopProducts = async () => {
        const response = await fetchData('/api/products/top');
        if(response.success) setTopProducts(response.topProducts)
    }

    const getAllProducts = async () => {
        setLoading(true);
        const response = await getProducts(`page=${pagination.page}&limit=${20}&category=${selectedCategory}&min=${value[0]}&max=${value[1]}&visibility=Published&sort=${selectedSort}&searchTerm=${searchTerm ?? ''}`);
        
        if(response.success) {
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
            }))
            setProducts(response.products.map((product : any) => ({
                ...product,
                image: product.thumbnail.imageUrl,
                price: product.product_type === 'Variable' ?  product.variants.sort((a : any, b: any) => (a.price - b.price))[0].price : product.price
                })))
        }
        setLoading(false);
    }

    useEffect(() => {
        getTopProducts();
        getCategories();
    }, [])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getAllProducts()
        }, 300); 

        return () => clearTimeout(delayDebounce);
    }, [pagination.page, selectedCategory, selectedSort])

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value }))
    };

    const filterProducts = async () => {
        setLoading(true);
        const response = await getProducts(`page=1&limit=${20}&category=${selectedCategory}&min=${value[0]}&max=${value[1]}&visibility=Published&sort=${selectedSort}`);
        
        if(response.success) {
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
                page: response.page
            }))
            setProducts(response.products.map((product : any) => ({
                ...product,
                image: product.thumbnail.imageUrl,
                price: product.product_type === 'Variable' ?  
                    product.variants
                    .sort((a : any, b: any) => (a.price - b.price))[0].price 
                    : product.price
                })))
        }
        setLoading(false);
    }

    if (user && user.role === 'Admin' && !userLoading) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="flex flex-col md:flex-row pt-20">
            <div className={cn("transition-colors duration-600 relative flex-1 p-3 lg:p-10 bg-gray-100", isDark && 'bg-gradient-to-r from-gray-900 via-black to-gray-800')}>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
                <div className="w-full flex flex-wrap gap-10 justify-between items-center mt-4">
                    {searchTerm ? <p className={cn('my-2 text-2xl', isDark && 'text-white')}>Results for: {searchTerm}</p> : <Title className="text-2xl md:text-3xl">Products</Title>}
                    <div className="flex gap-5 md:flex-1 max-w-[600px]">
                        <CustomizedSelect 
                            label="Category"
                            menu={[
                                { label: 'All', value: 'All'},
                                ...categories.map(category => ({ label: category.category_name, value: category.category_name}))
                            ]}
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value as string)
                                setPagination(prev => ({...prev, page: 1}))
                            }}
                        />
                        <CustomizedSelect 
                            label="Sort by"
                            menu={options.map(option => ({ label: option.label, value: option.value }))}
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value as string)}
                        />
                    </div>
                </div>
                {loading ? <div className="w-full h-[400px] flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red'}}/>
                </div> : 
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 my-10 md:gap-10 gap-3">
                    {products.map((product : any) => <CustomerProductContainer key={product._id} product={product}/>)}
                </div>}
                {products.length > 0 &&  (
                    <div className="flex justify-end">
                        <CustomizedPagination 
                            count={pagination.totalPages}
                            onChange={handlePage}
                            shape="rounded"
                            size="large" 
                        />
                    </div>
                )}
            </div>
            
            <aside className={cn("hidden xl:flex transition-colors duration-600 px-5 py-10 w-[330px] border-l border-gray-300 flex-col gap-10", isDark && 'bg-[#121212] border-gray-600')}>
                <div className="flex flex-col gap-6 px-5">
                    <h1 className={cn("mb-6 font-bold text-xl", isDark && 'text-white')}>Filter by Price</h1>
                    <Slider
                        value={value}
                        onChange={handleSlider}
                        valueLabelDisplay="auto"
                        step={500}
                        marks={marks} 
                        min={0}
                        max={10000}
                        sx={{
                            color: 'red',
                            '& .MuiSlider-rail': {
                                backgroundColor: isDark ? '#60a5fa' : '#3b82f6', // track color
                            }, 
                            '& .MuiSlider-markLabel': {
                                color: isDark ? '#e5e7eb' : 'black', 
                            },
                        }}
                    />
                    <RedButton onClick={filterProducts}>Filter</RedButton>
                </div>
                <div className={cn("flex flex-col mt-12", isDark && 'text-white')}>
                    <h1 className="font-bold text-lg">Most Popular Products</h1>
                    {topProducts.map(product => (
                        <div 
                            key={product._id}
                            className={cn("cursor-pointer hover:bg-gray-100 p-3 rounded-md",
                                isDark && 'hover:bg-[#3d3d3d]'
                            )}
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <TopProductsContainer product={product} />
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    )
}

export default CustomerProducts