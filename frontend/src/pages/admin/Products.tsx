import { Button, TableRow } from "@mui/material"
import CustomizedTable, { StyledTableCell, StyledTableRow } from "../../components/Table"
import { SearchField } from "../../components/Textfield"
import DashboardCard from "../../components/DashboardCard"
import { RedButton } from "../../components/Button"
import { useEffect, useState } from "react"
import CreateCategoryModal from "../../components/modals/CreateCategory"
import { fetchData } from "../../services/api"
import { CustomizedChip } from "../../components/Chip"
import { confirmDialog } from "../../utils/swal"
import { deleteData } from "../../services/api"
import { useNavigate } from "react-router-dom"

const deleteCategory = async (id : string) => {
    const confirmed = await confirmDialog('Are you sure you want to remove?', 'You won\'t be able to revert this!')

    if (confirmed) {
        const response = await deleteData(`/api/category/${id}`)   
        if(response.success) window.location.reload(); 
    }
}

const Products = () => {
    const [openCategory, setOpenCategory] = useState<boolean>(false);
    const [categories, setCategories] = useState<[Category]>();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const navigate = useNavigate();

    useEffect(() => {
        const getCategories = async () => {
            const response = await fetchData('/api/category');

            if(response.success) setCategories(response.categories)
        }

        getCategories();
    }, [])

    return <div className="flex bg-gray-100 h-full">
        <CreateCategoryModal close={() => setOpenCategory(false)} open={openCategory}/>
        
        <div className="flex-1 flex flex-col p-5">
            <div className="flex items-center mb-6 justify-between">
                <h1 className="text-red-500 font-bold text-4xl">Products</h1>
                <div className="flex gap-10">
                    <Button 
                        sx={{ color: 'red', borderColor: 'red'}} 
                        variant="outlined"
                        onClick={() => setOpenCategory(true)}
                    >Add Category</Button>
                    <RedButton onClick={() => navigate('/admin/product')}>Add Product</RedButton>
                </div>
            </div>
            <div className="flex-grow min-h-0 flex flex-col p-5 bg-white rounded-lg shadow-md">
                <SearchField 
                    sx={{ width: '400px'}}
                    placeholder="Search product (Product name, SKU, Category)"
                />
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
                        cols={
                            <TableRow>
                                <StyledTableCell align="left">Product name</StyledTableCell>
                                <StyledTableCell align="left">Stock</StyledTableCell>
                                <StyledTableCell align="center">Category</StyledTableCell>
                                <StyledTableCell align="center">Created at</StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                            </TableRow>
                        }
                        rows={
                            <>
                                <StyledTableRow>
                                    <StyledTableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    Product
                                    </StyledTableCell>
                                    <StyledTableCell>100</StyledTableCell>
                                    <StyledTableCell align="center">Category A</StyledTableCell>
                                    <StyledTableCell align="center">2024-01-01</StyledTableCell>
                                    <StyledTableCell align="center">Edit | Delete</StyledTableCell>
                                </StyledTableRow>
                            </>
                        }
                    />
                </div>
            </div>
        </div>
        <div className="w-[400px] p-5 flex flex-col gap-5">
            <DashboardCard label="Total Products" value="20"/>
            <DashboardCard label="Total Products Sold" value="100"/>

            
        </div>
    </div>
}

export default Products