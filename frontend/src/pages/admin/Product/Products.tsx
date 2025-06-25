import { Button, Pagination } from "@mui/material"
import CustomizedTable from "../../../components/Table"
import { SearchField } from "../../../components/Textfield"
import DashboardCard from "../../../components/DashboardCard"
import { RedButton } from "../../../components/Button"
import { useEffect, useState } from "react"
import CreateCategoryModal from "../../../components/product/CreateCategory"
import { fetchData } from "../../../services/api"
import { CustomizedChip } from "../../../components/Chip"
import { confirmDialog } from "../../../utils/swal"
import { deleteData } from "../../../services/api"
import { useNavigate } from "react-router-dom"
import { PieChart } from "@mui/x-charts"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { ProductTableColumns, ProductTableRow } from "../../../components/product/ProductTable"

const categoryData = {
    data: [
        { id: 0, value: 40, label: "Full-faced Helmet" },
        { id: 2, value: 15, label: "Topbox" },
    ]
};

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
]

const deleteCategory = async (id : string) => {
    const confirmed = await confirmDialog('Remove this category?', 'You won\'t be able to revert this!')

    if (confirmed) {
        const response = await deleteData(`/api/category/${id}`)   
        if(response.success) window.location.reload(); 
    }
}

const Products = () => {
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });
    const [categories, setCategories] = useState<Category[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<Product[]>();
    const navigate = useNavigate();

    const getCategories = async () => {
        const response = await fetchData('/api/category');

        if(response.success) setCategories(response.categories)
    }

    const getProducts = async () => {
        const response = await fetchData(`/api/product?page=${pagination.page}&limit=100&searchTerm=${pagination.searchTerm}&category=${selectedCategory}`);

        if(response.success) {
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
            }))
            setProducts(response.products)
        }
    }

    useEffect(() => {
        getProducts();
        getCategories();
    }, [pagination.page, selectedCategory])

    useEffect(() => {
        setSelectedCategory('All')
    }, [pagination.searchTerm])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getProducts();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm])

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    return <div className="flex bg-gray-100 h-full">
        <CreateCategoryModal close={() => setOpenCategory(false)} open={openCategory}/>
        
        <div className="flex-1 flex flex-col p-5">
            <div className="flex items-center mb-6 justify-between">
                <div>
                    <h1 className="font-bold text-4xl mb-4">Products</h1>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <div className="flex gap-10">
                    <Button 
                        sx={{ color: 'red', borderColor: 'red'}} 
                        variant="outlined"
                        onClick={() => setOpenCategory(true)}
                    >Add Category</Button>
                    <RedButton onClick={() => navigate('/admin/products/product')}>Add Product</RedButton>
                </div>
            </div>
            <div className="flex-grow min-h-0 flex flex-col p-5 bg-white rounded-lg shadow-md border-1 border-gray-300">
                <div className="flex items-center justify-between">
                    <SearchField 
                        sx={{ width: '400px'}}
                        onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value }))}
                        placeholder="Search by Product name, SKU, Category..."
                    />
                    <Pagination count={pagination.totalPages} onChange={handlePage} />
                </div>
                <div className="flex overflow-x-auto mt-4 gap-2">
                    <CustomizedChip 
                        onClick={() => setSelectedCategory('All')} 
                        label="All"
                        isSelected={selectedCategory === 'All'}
                    />
                    {categories && categories.map(category => 
                        <CustomizedChip 
                            onClick={() => setSelectedCategory(category.category_name)}
                            isSelected={selectedCategory === category.category_name}
                            label={category.category_name} 
                            onDelete={() => deleteCategory(category._id)} 
                        />
                    )}
                </div>
                <div className="min-h-0 flex-grow overflow-y-auto mt-6">
                    <CustomizedTable
                        cols={<ProductTableColumns />}
                        rows={products?.map(product => <ProductTableRow product={product}/>)
                        }
                    />
                </div>
            </div>
        </div>
        <div className="w-[400px] p-5 flex flex-col gap-5">
            <DashboardCard label="Total Products" value="20"/>
            <DashboardCard label="Total Products Sold" value="100"/>

            <div className="bg-white p-5 shadow-lg border-1 border-gray-200 rounded-md">
                <h1 className="text-lg font-bold">Most Popular Categories</h1>
                <PieChart
                    series={[ categoryData ]}
                    width={300}
                    height={300}
                />
            </div>
        </div>
    </div>
}

export default Products