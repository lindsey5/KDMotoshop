import {  useMemo, useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs";
import CustomerProductContainer from "./ui/CustomerProductContainer";
import { CircularProgress, Slider } from "@mui/material";
import { CustomizedSelect } from "../../../components/Select";
import TopProductsContainer from "../../ui/TopProductContainer";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import CustomizedPagination from "../../../components/Pagination";
import { Title } from "../../../components/text/Text";
import { useSelector } from "react-redux";
import type { RootState } from "../../../features/store";
import useFetch from "../../../hooks/useFetch";
import { useDebounce } from "../../../hooks/useDebounce";

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
    const [selectedCategory, setSelectedCategory] = useState<string>(category || 'All');
    const [selectedSort, setSelectedSort] = useState<string>(options[0].value);
    const isDark = useDarkmode();
    const [value, setValue] = useState<number[]>([0, 10000]);
    const minDistance = 1000;
    const [page, setPage] = useState(1);
    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)
    const valueDebounce = useDebounce<number[]>(value, 500);
    const min = valueDebounce?.[0] ?? 0;
    const max = valueDebounce?.[1] ?? 10000; 
    const { data : productsRes, loading : productsLoading } = useFetch(`/api/products?page=${page}&limit=${20}&min=${min}&max=${max}&category=${selectedCategory}&visibility=Published&sort=${selectedSort}&searchTerm=${searchTerm || ''}`)
    const { data : topProductsRes } = useFetch('/api/products/top');
    const { data : categoriesRes } = useFetch('/api/categories');

    const products = useMemo(() => {
        if(!productsRes?.products) return []

        return productsRes.products.map((product : any) => ({
            ...product,
            image: product.thumbnail.imageUrl,
            price: product.product_type === 'Variable' ?  
                product.variants
                .sort((a : any, b: any) => (a.price - b.price))[0].price 
                : product.price
        }))

    }, [productsRes])

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

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    if (user && user.role === 'Admin' && !userLoading) {
        return <Navigate to="/admin/login" />;
    }


    return (
        <div className="flex flex-col md:flex-row pt-20">
            <div className={cn("transition-colors duration-600 relative flex-1 p-3 lg:p-10 bg-gray-100", isDark && 'bg-gradient-to-r from-gray-900 via-black to-gray-800')}>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
                <div className="w-full flex flex-col md:flex-row flex-wrap gap-10 md:justify-between md:items-center mt-4">
                    {searchTerm ? <p className={cn('my-2 text-2xl', isDark && 'text-white')}>Results for: {searchTerm}</p> : <Title className="text-2xl md:text-3xl">Products</Title>}
                    <div className="flex gap-5 md:flex-1 md:max-w-[600px]">
                        <CustomizedSelect 
                            label="Category"
                            menu={[
                                { label: 'All', value: 'All'},
                                ...(categoriesRes?.categories.map((category : Category) => ({ label: category.category_name, value: category.category_name})) || [])
                            ]}
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value as string)
                                setPage(1);
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
                {productsLoading ? <div className="w-full h-[400px] flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red'}}/>
                </div> : 
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 my-10 md:gap-10 gap-3">
                    {products.map((product : Product) => <CustomerProductContainer key={product._id} product={product}/>)}
                </div>}
                {products.length > 0 &&  (
                    <div className="flex justify-end">
                        <CustomizedPagination 
                            count={productsRes.totalPages}
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
                </div>
                <div className={cn("flex flex-col mt-12", isDark && 'text-white')}>
                    <h1 className="font-bold text-lg">Most Popular Products</h1>
                    {topProductsRes?.topProducts.map((product : TopProduct) => (
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