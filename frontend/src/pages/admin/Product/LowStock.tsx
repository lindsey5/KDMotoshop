import BreadCrumbs from "../../../components/BreadCrumbs"
import Card from "../../../components/Card"
import PageContainer from "../ui/PageContainer"
import { LowStockTableColumns, LowStockTableRow } from "./ui/LowStocksTable"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import useFetch from "../../../hooks/useFetch"
import { CircularProgress } from "@mui/material"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Low Stocks', href: '/admin/products/low-stocks' },
]

const LowStockProducts = () => {
    const { data, loading } = useFetch('/api/products/low-stock')

    return (
        <PageContainer className="w-full flex flex-col gap-5">
            <Title className="mb-4">Low Stock Products</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
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