import BreadCrumbs from "../../../components/BreadCrumbs"
import Card from "../../../components/Card"
import PageContainer from "../ui/PageContainer"
import { LowStockTableColumns, LowStockTableRow } from "./ui/LowStocksTable"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import useFetch from "../../../hooks/useFetch"
import { Button, CircularProgress } from "@mui/material"
import { formatDate } from "../../../utils/dateUtils"
import { exportData } from "../../../utils/utils"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Low Stocks', href: '/admin/products/low-stocks' },
]

const LowStockProducts = () => {
    const { data, loading } = useFetch('/api/products/low-stock')

     const exportReport= () => {
        const dataToExport = data?.products.map((p : any) => ({
            SKU: p.sku,
            Product: p.product_name,
            SafetyStock: p.safetyStock,
            ReorderLevel: p.reorderLevel,
            ReOrderQuantity: p.reorderQuantity,
            Status: p.status
        }))
        
        exportData({ dataToExport, filename: `KDMotoshop - Low Stock Report (${formatDate(new Date())}).xlsx`, sheetname: 'Inventory'})
    }

    return (
        <PageContainer className="w-full flex flex-col gap-5">
            <div className="justify-between flex items-center">
                <div>
                    <Title className="mb-4">Low Stock Products</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <Button variant="contained" onClick={exportReport}>Export</Button>
            </div>
            <Card className="h-screen overflow-y-auto">
                <CustomizedTable 
                    cols={<LowStockTableColumns />}
                    rows={data?.products.map((product : any) => <LowStockTableRow product={product}/>)}
                />
                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
            </Card>
        </PageContainer>
    )
}

export default LowStockProducts