import { useEffect, useState } from "react"
import { fetchData } from "../../../services/api"
import { cn } from "../../../utils/utils";
import BreadCrumbs from "../../../components/BreadCrumbs";
import CustomerProductContainer from "../../../components/customer/ProductContainer";
import { Pagination } from "@mui/material";
import { CustomSelect } from "../../../components/Select";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products'}
]

const options = ['Rating high to low', 'Rating low to high', 'Price low to high', 'Price high to low']

const CustomerProducts = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSort, setSelectedSort] = useState<string>(options[0]);
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });

    const handleChange = (_t: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}));
    };

    const getCategories = async () => {
        const response = await fetchData('/api/category')
        if(response.success) setCategories(response.categories)
    }

    const getProducts = async () => {
        const response = await fetchData(`/api/product?page=${pagination.page}&limit=${20}&category=${selectedCategory}`);

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
        getProducts();
        getCategories();
    }, [pagination.page, selectedCategory])

    return (
        <div className="flex pt-20">
            <aside className="border-r-1 border-gray-300">
                <div className="pl-5 pt-8">
                    <h1 className="text-gray-400 text-base">Categories</h1>
                </div>
                <div className="w-[200px] flex flex-col gap-5 mt-6">
                    <button
                        className={cn("pl-5 py-2 relative text-start hover:text-red-400 hover:bg-red-100 cursor-pointer",
                            selectedCategory === 'All' && "text-lg text-red-400 font-bold after:content-[''] after:top-0 after:bottom-0 after:w-[5px] after:bg-red-500 after:absolute after:rounded-md after:right-0"
                        )}
                        onClick={() => setSelectedCategory('All')}
                    
                    >All</button>
                    {categories.map(category => (
                        <button
                        key={category.category_name}
                        className={cn("pl-5 py-2 relative text-start hover:text-red-400 hover:bg-red-100 cursor-pointer",
                            selectedCategory === category.category_name && "text-lg text-red-400 font-bold after:content-[''] after:top-0 after:bottom-0 after:w-[5px] after:bg-red-500 after:absolute after:rounded-md after:right-0"
                        )}
                        onClick={() => setSelectedCategory(category.category_name)}
                        >{category.category_name}</button>
                    ))}
                </div>
            </aside>
            <div className="relative flex-1 p-10">
                <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
                <div className="w-full flex justify-between items-center">
                    <h1 className="text-4xl text-red-400 font-bold mt-4">Products</h1>
                    <CustomSelect options={options} selected={selectedSort} setSelected={setSelectedSort}/>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 md:gap-10 gap-5">
                {products.map((product) => <CustomerProductContainer key={product._id} product={product}/>)}
                </div>
                {products.length > 0 && (
                    <div className="flex justify-end">
                        <Pagination
                            count={pagination.totalPages}
                            onChange={handleChange}
                            shape="rounded"
                            size="large"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomerProducts