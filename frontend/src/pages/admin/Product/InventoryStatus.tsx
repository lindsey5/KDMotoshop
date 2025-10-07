import BreadCrumbs from "../../../components/BreadCrumbs"
import Card from "../../../components/Card"
import PageContainer from "../ui/PageContainer"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import useFetch from "../../../hooks/useFetch"
import { Button, CircularProgress } from "@mui/material"
import { formatDate } from "../../../utils/dateUtils"
import { exportData } from "../../../utils/utils"
import CustomizedPagination from "../../../components/Pagination"
import { StockStatusChip } from "../../../components/Chip"
import { useState } from "react"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Inventory Status', href: '/admin/inventory-status' },
]

const InventoryStatus = () => {
    const [page, setPage] = useState(1);
    const { data, loading } = useFetch(`/api/products/inventory-status?page=${page}&limit=5`)

    const exportReport= () => {
        const dataToExport = data?.products.map((p : ProductInventoryStatus) => ({
            SKU: p.sku,
            Product: p.product_name,
            Stock: p.stock,
            ReorderLevel: p.reorderLevel,
            ReOrderQuantity: p.optimalStockLevel,
            UnitsToReduce: p.status === 'Overstock' ? p.amount : 0,
            UnitsToRestock: p.status === 'Understock' ? p.amount : 0,
            Status: p.status
        }))
        
        exportData({ dataToExport, filename: `KDMotoshop - Inventory Status Report (${formatDate(new Date())}).xlsx`, sheetname: 'Inventory'})
    }

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    return (
        <PageContainer className="w-full flex flex-col gap-5">
            <div className="justify-between flex items-center">
                <div>
                    <Title className="mb-4">Inventory Status</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <Button variant="contained" onClick={exportReport}>Export</Button>
            </div>
            <Card className="h-screen overflow-y-auto">
                <CustomizedTable 
                    cols={['Product name', 'Stock', 'SKU', 'Product Type', 'Reorder Level', 'Optimal Stock', 'Suggestion', 'Status']}
                    rows={data?.products.map((product : ProductInventoryStatus) => ({
                        'Product name' : (
                            <div className="flex items-center gap-2 min-w-[200px]">
                            <img 
                                className="bg-gray-100 w-12 h-12 object-cover rounded"
                                src={product.thumbnail.imageUrl}
                                alt="thumbnail"
                            />
                            <span>{product.product_name}</span>
                            </div>
                        ),
                        'Stock' : product.stock,
                        'SKU' : product.sku,
                        'Product Type' : product.product_type,
                        'Reorder Level' : product.reorderLevel,
                        'Optimal Stock' : product.optimalStockLevel,
                        'Suggestion' : (
                            product.status === "Overstock"
                            ? `Reduce inventory by ${product.amount} units`
                            : product.status === "Understock" || product.status === 'Out of Stock'
                            ? `Restock ${product.amount} units`
                            : "No action needed"
                        ),
                        'Status' : <StockStatusChip status={product.status}/>
                    })) || []}
                />
                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <CustomizedPagination 
                        count={data?.totalPages} 
                        onChange={handlePage} 
                        page={page}
                        disabled={loading}
                    />
                </div>
            </Card>
        </PageContainer>
    )
}

export default InventoryStatus