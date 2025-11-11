import { Button, CircularProgress, IconButton, Tooltip } from "@mui/material"
import CustomizedTable from "../../../components/Table"
import { SearchField } from "../../../components/Textfield"
import { useMemo, useState } from "react"
import CreateCategoryModal from "./ui/CreateCategory"
import { CustomizedChip } from "../../../components/Chip"
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal"
import { deleteData } from "../../../services/api"
import BreadCrumbs from "../../../components/BreadCrumbs"
import Card from "../../../components/Card"
import useDarkmode from "../../../hooks/useDarkmode"
import CustomizedPagination from "../../../components/Pagination"
import { RedButton } from "../../../components/buttons/Button"
import { useNavigate, type NavigateFunction } from "react-router-dom"
import { Title } from "../../../components/text/Text"
import PageContainer from "../ui/PageContainer"
import { exportData } from "../../../utils/utils"
import { formatDate } from "../../../utils/dateUtils"
import useFetch from "../../../hooks/useFetch"
import { useDebounce } from "../../../hooks/useDebounce"
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Products', href: '/admin/products' },
]

const ProductRow = (product : Product, isDark : boolean, navigate : NavigateFunction) => {
    const deleteProduct = async (product_id : string) => {
        if (await confirmDialog('Delete Product?', 'Are you sure you want to delete this product?')) {
          const response = await deleteData(`/api/products/${product_id}`);
          
          if (!response.success) {
            await errorAlert(response.message, 'Please try again.', isDark);
            return;
          }
    
          await successAlert(response.message, '', isDark);
          window.location.reload();
        }
    };
    
    return {
        Product: (
            <div className="flex items-center gap-2 min-w-[200px]">
                <img
                className="bg-gray-100 w-12 h-12 object-cover rounded"
                src={
                    typeof product.thumbnail === "object" &&
                    product.thumbnail !== null &&
                    "imageUrl" in product.thumbnail
                    ? product.thumbnail.imageUrl
                    : typeof product.thumbnail === "string"
                    ? product.thumbnail
                    : "/photo.png"
                }
                alt="thumbnail"
                />
                <span>{product.product_name}</span>
            </div>
            ),
        Stock:
            product.product_type === "Single"
                ? product.stock
                : product.variants.reduce(
                    (total, v) => total + (v.stock || 0),
                    0
                ),
        Category: product.category,
        "Product Type": product.product_type,
        "Created At": formatDate(product.createdAt),
        "Created By": `${product.added_by?.firstname} ${product.added_by?.lastname}`,
        Rating: `${product.rating} / 5`,
        Visibility: product.visibility,
        Actions: (
            <div className="flex">
                <Tooltip title="Edit Product">
                <IconButton onClick={() => navigate(`/admin/product?id=${product._id}`)}>
                    <EditIcon sx={{ color: isDark ? "white" : "inherit" }} />
                </IconButton>
                </Tooltip>

                <Tooltip title="View Reviews">
                <IconButton onClick={() => navigate(`/admin/reviews/${product._id}`)}>
                    <StarIcon sx={{ color: isDark ? "white" : "inherit" }} />
                </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                <IconButton onClick={() => deleteProduct(product._id || "")}>
                    <DeleteIcon sx={{ color: isDark ? "white" : "inherit" }} />
                </IconButton>
                </Tooltip>
            </div>
        )
    }
}

const Products = () => {
    const isDark = useDarkmode();
    const navigate = useNavigate();
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [page, setPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data : categoriesRes } = useFetch('/api/categories');
    const { data : productsRes, loading } = useFetch(`/api/products?page=${page}&limit=50&searchTerm=${searchDebounce}&category=${selectedCategory}`)

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }
    
    const cols = useMemo(() => ['Product', 'Stock', 'Category', 'Product Type', 'Created At', 'Created By', 'Rating', 'Visibility', 'Actions'], [])
    const rows = useMemo(() => productsRes?.products.map((product: Product) => ProductRow(product, isDark, navigate)) || [], [productsRes?.products]);

    const deleteCategory = async (id: string) => {
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
    }

    const handleCategoryClick = (category : string) => {
        if (category === selectedCategory) return;
        
        setSelectedCategory(category);
        setPage(1);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setPage(1)
    };
    
    const exportProducts = () => {
        const dataToExport : any[] = []
        
        productsRes?.products.forEach((product : Product) => {
            if(product.product_type === 'Single'){
                dataToExport.push({
                    product_name: product.product_name,
                    sku: product.sku,
                    stock: product.stock,
                    category: product.category,
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
                {categoriesRes?.categories.map((category : Category) => 
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
                        value={searchTerm}
                    />
                    <Button variant="contained" onClick={exportProducts}>Export</Button>
                </div>
                <CustomizedTable
                    cols={cols}
                    rows={rows}
                />
                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <CustomizedPagination 
                        count={productsRes?.totalPages} 
                        onChange={handlePage} 
                        page={page}
                        disabled={loading}
                    />
                </div>
            </Card>
        </PageContainer>
    );
};

export default Products