import { Button, CircularProgress } from "@mui/material"
import CustomizedTable from "../../../components/Table"
import { SearchField } from "../../../components/Textfield"
import { useCallback, useEffect, useState } from "react"
import CreateCategoryModal from "./ui/CreateCategory"
import { fetchData } from "../../../services/api"
import { CustomizedChip } from "../../../components/Chip"
import { confirmDialog } from "../../../utils/swal"
import { deleteData } from "../../../services/api"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { ProductTableRow, ProductTableColumns } from "./ui/ProductTable"
import Card from "../../../components/Card"
import useDarkmode from "../../../hooks/useDarkmode"
import CustomizedPagination from "../../../components/Pagination"
import { RedButton } from "../../../components/buttons/Button"
import { useNavigate } from "react-router-dom"
import { Title } from "../../../components/text/Text"
import PageContainer from "../ui/PageContainer"
import usePagination from "../../../hooks/usePagination"
import { exportData } from "../../../utils/utils"
import { formatDate } from "../../../utils/dateUtils"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
]

const Products = () => {
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const { pagination, setPagination } = usePagination();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const fetchDataTogether = async () => {
                setIsLoading(true);
                const [categoryRes, productRes] = await Promise.all([
                    fetchData('/api/categories'),
                    fetchData(`/api/products?page=${pagination.page}&limit=50&searchTerm=${pagination.searchTerm}&category=${selectedCategory}`)
                ]);

                if (categoryRes.success) setCategories(categoryRes.categories || []);

                if (productRes.success) {
                    setPagination(prev => ({
                        ...prev,
                        totalPages: productRes.totalPages || 1,
                    }));
                    setProducts(productRes.products || []);
                }
                setIsLoading(false);
            };
            fetchDataTogether();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm, pagination.page, selectedCategory]);

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({ ...prev, page: value }));
    }

    const deleteCategory = useCallback(async (id: string) => {
        const confirmed = await confirmDialog('Remove this category?', 'You won\'t be able to revert this!', isDark);

        if (confirmed) {
            try {
                const response = await deleteData(`/api/categories/${id}`);
                if (response.success) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    }, [isDark, categories, selectedCategory]);

    const handleCategoryClick = (category : string) => {
        if (category === selectedCategory) return;
        
        setSelectedCategory(category);
        setPagination(prev => ({ ...prev, page: 1 }));
        setIsLoading(true);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPagination(prev => ({ 
            ...prev, 
            searchTerm: e.target.value,
            page: 1
        }));
    };
    
    const exportProducts = () => {
        const dataToExport : any[] = []
        
        products.forEach(product => {
            if(product.product_type === 'Single'){
                dataToExport.push({
                    product_name: product.product_name,
                    sku: product.sku,
                    stock: product.stock,
                    category: product.category,
                    weight: product.weight,
                    rating: product.rating,
                    price: product.price
                })
            }else{
                product.variants.forEach(variant => {
                    dataToExport.push({
                        product_name: product.product_name,
                        sku: variant.sku,
                        stock: variant.stock,
                        category: product.category,
                        weight: product.weight,
                        rating: product.rating,
                        price: variant.price
                    })
                })
            }
        })
        exportData({ dataToExport, filename: `KDMotoshop - Inventory (${formatDate(new Date())}).xlsx`, sheetname: 'Inventory'})
    }

    return (
        <PageContainer className="w-full flex flex-col">
            <CreateCategoryModal 
                close={() => setOpenCategory(false)} 
                open={openCategory}
            />
            <div className="flex items-start mb-6 justify-between gap-5 flex-wrap">
                <div>
                    <Title className="mb-4">Products</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
                </div>
                <div className="flex gap-4">
                    <Button 
                        sx={{ 
                            color: isDark ? 'white' : 'red', 
                            borderColor: isDark ? 'white' : 'red'
                        }} 
                        variant="outlined"
                        onClick={() => setOpenCategory(true)}
                    >
                        Add Category
                    </Button>
                    <RedButton onClick={() => navigate('/admin/product')}>
                        Add Product
                    </RedButton>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
                <CustomizedChip 
                    onClick={() => handleCategoryClick('All')} 
                    label="All"
                    isSelected={selectedCategory === 'All'}
                />
                {categories.map(category => 
                    <CustomizedChip 
                        key={category._id}
                        onClick={() => handleCategoryClick(category.category_name)}
                        isSelected={selectedCategory === category.category_name}
                        label={category.category_name} 
                        onDelete={() => deleteCategory(category._id)} 
                    />
                )}
            </div>
            
            <Card className="h-screen flex flex-col mt-5">
                <div className="w-full mb-6 flex items-center justify-between gap-5">
                    <SearchField 
                        sx={{ width: '100%', maxWidth: '350px' }}
                        onChange={handleSearchChange}
                        placeholder="Search by Product name, SKU, Category..."
                        value={pagination.searchTerm || ''}
                    />
                    <Button variant="contained" onClick={exportProducts}>Export</Button>
                </div>
                <CustomizedTable
                    cols={<ProductTableColumns />}
                    rows={products.map(product => 
                        <ProductTableRow key={product._id} product={product} />
                    )}
                />
                {isLoading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <CustomizedPagination 
                        count={pagination.totalPages} 
                        onChange={handlePage} 
                        page={pagination.page}
                        disabled={isLoading}
                    />
                </div>
            </Card>
        </PageContainer>
    );
};

export default Products