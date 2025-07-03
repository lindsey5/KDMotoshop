import { Button, Pagination } from "@mui/material"
import CustomizedTable from "../../../components/Table"
import { SearchField } from "../../../components/Textfield"
import { RedButton } from "../../../components/Button"
import { useEffect, useState } from "react"
import CreateCategoryModal from "../../../components/modals/admin/CreateCategory"
import { fetchData } from "../../../services/api"
import { CustomizedChip } from "../../../components/Chip"
import { confirmDialog } from "../../../utils/swal"
import { deleteData } from "../../../services/api"
import { useNavigate } from "react-router-dom"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { ProductTableColumns, ProductTableRow } from "../../../components/tables/ProductTable"
import Card from "../../../components/Card"

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

    return( 
        <div className="flex flex-col bg-gray-100 h-full p-5">
            <CreateCategoryModal close={() => setOpenCategory(false)} open={openCategory}/>
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
            <Card className="flex-grow min-h-0 flex flex-col ">
                <div className="flex items-center justify-between">
                    <SearchField 
                        sx={{ width: '400px'}}
                        onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value }))}
                        placeholder="Search by Product name, SKU, Category..."
                    />
                    <Pagination count={pagination.totalPages} onChange={handlePage} />
                </div>
                <div className="flex overflow-x-auto mt-4 mb-6 gap-2">
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
                <CustomizedTable
                    cols={<ProductTableColumns />}
                    rows={products?.map(product => <ProductTableRow key={product._id} product={product}/>)}
                />
            </Card>
        </div>
    )
}

export default Products