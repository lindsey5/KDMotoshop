import BreadCrumbs from "../../../components/BreadCrumbs"
import Card from "../../../components/cards/Card"
import PageContainer from "../../../components/containers/admin/PageContainer"
import { LowStockTableColumns, LowStockTableRow } from "../../../components/tables/LowStocksTable"
import CustomizedTable from "../../../components/tables/Table"
import { Title } from "../../../components/text/Text"
import useFetch from "../../../hooks/useFetch"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Low Stocks', href: '/admin/products/low-stocks' },
]

const LowStockProducts = () => {
    const { data } = useFetch('/api/products/low-stock')

    return (
        <PageContainer className="w-full flex flex-col gap-5">
            <Title className="mb-4">Low Stock Products</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="h-screen overflow-y-auto">
                <CustomizedTable 
                    cols={<LowStockTableColumns />}
                    rows={data?.products.map((product : any) => <LowStockTableRow product={product}/>)}
                />
            </Card>
        </PageContainer>
    )
}

export default LowStockProducts