import { useEffect, useState } from "react"
import { fetchData } from "../../../services/api"
import BreadCrumbs from "../../../components/BreadCrumbs";
import CustomerProductContainer from "../../../components/containers/customer/CustomerProductContainer";
import { Pagination, Slider } from "@mui/material";
import { CustomizedSelect } from "../../../components/Select";
import { RedButton } from "../../../components/Button";
import { getProducts } from "../../../services/productService";
import TopProductsContainer from "../../../components/containers/TopProductContainer";
import { useNavigate, useSearchParams } from "react-router-dom";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products'}
]

const options = ['Rating high to low', 'Rating low to high', 'Price low to high', 'Price high to low']

const CustomerProducts = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(category || 'All');
    const [selectedSort, setSelectedSort] = useState<string>(options[0]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });
    const [value, setValue] = useState<number[]>([0, 10000]);
    const minDistance = 1000;
    
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
        const response = await fetchData('/api/category')
        if(response.success) setCategories(response.categories)
    }

    const getTopProducts = async () => {
        const response = await fetchData('/api/product/top');
        if(response.success) setTopProducts(response.topProducts)
    }

    const getAllProducts = async () => {
        const response = await getProducts(`page=${pagination.page}&limit=${30}&category=${selectedCategory}&min=${value[0]}&max=${value[1]}&visibility=Published`);
        
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
    }, [pagination.page, selectedCategory])

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value }))
    };

    const filterProducts = async () => {
        const response = await getProducts(`page=1&limit=${30}&category=${selectedCategory}&min=${value[0]}&max=${value[1]}&visibility=Published`);
        
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

    }

    return (
        <div className="flex pt-20">
            <div className="relative flex-1 bg-gray-50 p-10">
                <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
                <div className="w-full flex justify-between items-center mt-4">
                    <h1 className="text-4xl text-red-500 font-bold ">Products</h1>
                    <div className="flex gap-5 flex-1 max-w-[600px]">
                        <CustomizedSelect 
                            menu={[
                                { label: 'All', value: 'All'},
                                ...categories.map(category => ({ label: category.category_name, value: category.category_name}))
                            ]}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as string)}
                        />
                        <CustomizedSelect 
                            menu={options.map(option => ({ label: option, value: option}))}
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value as string)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 md:gap-10 gap-5">
                {products.map((product : any) => <CustomerProductContainer key={product._id} product={product}/>)}
                </div>
                {products.length > 0 &&  (
                    <div className="flex justify-end">
                        <Pagination
                            count={pagination.totalPages}
                            onChange={handlePage}
                            shape="rounded"
                            size="large"
                        />
                    </div>
                )}
            </div>
            <aside className="px-5 py-10 w-[330px] border-l-1 border-gray-300 flex flex-col gap-10">
                <div className="flex flex-col gap-6 px-5">
                    <h1 className="mb-6 font-bold text-xl">Filter by Price</h1>
                    <Slider
                        value={value}
                        onChange={handleSlider}
                        valueLabelDisplay="auto"
                        step={1000}
                        marks={marks} 
                        min={0}
                        max={10000}
                        sx={{
                            color: 'red', 
                        }}
                    />
                    <RedButton onClick={filterProducts}>Filter</RedButton>
                </div>
                <div className="flex flex-col mt-12">
                    <h1 className="font-bold text-lg">Most Popular Products</h1>
                    {topProducts.map(product => (
                        <div 
                            className="cursor-pointer hover:bg-gray-100 p-3 rounded-md"
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