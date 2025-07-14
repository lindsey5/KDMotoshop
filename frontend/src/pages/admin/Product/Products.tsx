import { Button } from "@mui/material"
import CustomizedTable from "../../../components/Table"
import { SearchField } from "../../../components/Textfield"
import { useEffect, useState } from "react"
import CreateCategoryModal from "../../../components/modals/admin/CreateCategory"
import { fetchData } from "../../../services/api"
import { CustomizedChip } from "../../../components/Chip"
import { confirmDialog } from "../../../utils/swal"
import { deleteData } from "../../../services/api"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { ProductTableColumns, ProductTableRow } from "../../../components/tables/ProductTable"
import Card from "../../../components/Card"
import { cn } from "../../../utils/utils"
import useDarkmode from "../../../hooks/useDarkmode"
import CustomizedPagination from "../../../components/Pagination"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
]

const Products = () => {
    const isDark = useDarkmode();
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });
    const [categories, setCategories] = useState<Category[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<Product[]>();
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

    const deleteCategory = async (id : string) => {
        const confirmed = await confirmDialog('Remove this category?', 'You won\'t be able to revert this!', isDark)

        if (confirmed) {
            const response = await deleteData(`/api/category/${id}`)   
            if(response.success) window.location.reload(); 
        }
    }

    return( 
        <div className={cn("transition-colors duration-600 flex flex-col bg-gray-100 h-full p-5", isDark && 'text-white bg-[#121212]')}>
            <CreateCategoryModal close={() => setOpenCategory(false)} open={openCategory}/>
            <div className="flex items-center mb-6 justify-between">
                <div>
                    <h1 className={cn("font-bold text-4xl mb-4 text-red-500", isDark && 'text-white')}>Products</h1>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <div className="flex gap-10">
                    <Button 
                        sx={{ 
                            color: isDark ? 'white' : 'red', 
                            borderColor: isDark ? 'white' : 'red'
                        }} 
                        variant="outlined"
                        onClick={() => setOpenCategory(true)}
                    >Add Category</Button>
                </div>
            </div>
            <Card className="flex-grow min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <SearchField 
                        sx={{ width: '400px'}}
                        onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value }))}
                        placeholder="Search by Product name, SKU, Category..."
                    />
                    <div className="flex items-center gap-5">
                        <div className="flex overflow-x-auto gap-2">
                            <CustomizedChip 
                                onClick={() => setSelectedCategory('All')} 
                                label="All"
                                isSelected={selectedCategory === 'All'}
                            />
                            {categories && categories.map(category => 
                                <CustomizedChip 
                                    key={category.category_name}
                                    onClick={() => setSelectedCategory(category.category_name)}
                                    isSelected={selectedCategory === category.category_name}
                                    label={category.category_name} 
                                    onDelete={() => deleteCategory(category._id)} 
                                />
                            )}
                        </div>
                        <CustomizedPagination 
                            count={pagination.totalPages} 
                            onChange={handlePage} 
                        />
                    </div>
                </div>
                <CustomizedTable
                    cols={<ProductTableColumns />}
                    rows={products?.map(product => <ProductTableRow key={product._id} product={product}/>)}
                />
            </Card>
        </div>
    )
}

export default Products