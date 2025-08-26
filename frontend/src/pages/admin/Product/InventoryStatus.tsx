import BreadCrumbs from "../../../components/BreadCrumbs"
import Card from "../../../components/Card"
import PageContainer from "../ui/PageContainer"
import { InventoryStatusTableColumns, InventoryStatusTableRow } from "./ui/InventoryStatusTable"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import useFetch from "../../../hooks/useFetch"
import { Button, CircularProgress } from "@mui/material"
import { formatDate } from "../../../utils/dateUtils"
import { exportData } from "../../../utils/utils"
import CustomizedPagination from "../../../components/Pagination"
import usePagination from "../../../hooks/usePagination"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Inventory Status', href: '/admin/inventory-status' },
]

const InventoryStatus = () => {
    const { pagination, setPagination } = usePagination();
    const { data, loading } = useFetch(`/api/products/inventory-status?page=${pagination.page}&limit=5`)

    const exportReport= () => {
        const dataToExport = data?.products.map((p : InventoryStatus) => ({
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
        setPagination(prev => ({ ...prev, page: value }));
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
                    cols={<InventoryStatusTableColumns />}
                    rows={data?.products.map((product : any) => <InventoryStatusTableRow product={product}/>)}
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
                        page={pagination.page}
                        disabled={loading}
                    />
                </div>
            </Card>
        </PageContainer>
    )
}

export default InventoryStatus