import { Button } from "@mui/material"
import CustomizedTable from "../../../components/Table"
import { SearchField } from "../../../components/Textfield"
import { useEffect, useState } from "react"
import CreateCategoryModal from "../../../components/modals/CreateCategory"
import { fetchData } from "../../../services/api"
import { CustomizedChip } from "../../../components/Chip"
import { confirmDialog } from "../../../utils/swal"
import { deleteData } from "../../../services/api"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { ProductTableColumns, ProductTableRow } from "../../../components/tables/ProductTable"
import Card from "../../../components/cards/Card"
import { cn } from "../../../utils/utils"
import useDarkmode from "../../../hooks/useDarkmode"
import CustomizedPagination from "../../../components/Pagination"
import { PaginationState } from "../../../constants/pagination"
import { RedButton } from "../../../components/Button"
import { useNavigate } from "react-router-dom"
import { Title } from "../../../components/text/Text"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
]

const Products = () => {
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [pagination, setPagination] = useState<Pagination>(PaginationState);
    const [categories, setCategories] = useState<Category[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<Product[]>();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSelectedCategory('All');

            const fetchDataTogether = async () => {
                const [categoryRes, productRes] = await Promise.all([
                    fetchData('/api/category'),
                    fetchData(`/api/product?page=${pagination.page}&limit=100&searchTerm=${pagination.searchTerm}&category=All`)
                ]);

                if (categoryRes.success) setCategories(categoryRes.categories);

                if (productRes.success) {
                    setPagination(prev => ({...prev,totalPages: productRes.totalPages,}));
                    setProducts(productRes.products);
                }
            };

            fetchDataTogether();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm, pagination.page]);


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
                    <Title className="mb-4">Products</Title>
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
                    <RedButton onClick={() => navigate('/admin/product')}>Add Product</RedButton>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
            <Card className="flex-grow min-h-0 flex flex-col mt-5">
                <div className="w-full mb-6 flex items-center justify-between">
                   <SearchField 
                        sx={{ width: '400px'}}
                        onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value }))}
                        placeholder="Search by Product name, SKU, Category..."
                    />
                    <CustomizedPagination 
                        count={pagination.totalPages} 
                        onChange={handlePage} 
                    />
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