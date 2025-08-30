import { useEffect, useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { RedButton } from "../../../components/buttons/Button"
import Card from "../../../components/Card"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import { SearchField } from "../../../components/Textfield"
import useFetch from "../../../hooks/useFetch"
import PageContainer from "../ui/PageContainer"
import usePagination from "../../../hooks/usePagination"
import { CircularProgress } from "@mui/material"
import { PurchaseOrdersTableColumns, PurchaseOrderTableRow } from "./ui/PurchaseOrdersTable"
import { useNavigate } from "react-router-dom"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Purchase Orders', href: '/admin/purchase-orders' },
]

const PurchaseOrdersPage = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { pagination, setPagination } = usePagination(); 
    const { data, loading } = useFetch(`/api/purchase-orders?searchTerm=${searchTerm}`)
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchTerm(pagination.searchTerm)
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm]);

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Title>Purchase Orders</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="min-h-0 flex-grow flex flex-col gap-5">
                <div className="flex gap-10 justify-between items-center">
                    <SearchField onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value}))} sx={{ maxWidth: '350px'}} placeholder="Search purchase order"/>
                    <RedButton onClick={() => navigate('/admin/purchase-order')}>Create Purchase Order</RedButton>
                </div>
                <div className="min-h-0 flex-grow overflow-y-auto">
                    <CustomizedTable
                        cols={<PurchaseOrdersTableColumns />}
                        rows={data?.purchaseOrders.map((purchaseOrder : PurchaseOrder) => <PurchaseOrderTableRow key={purchaseOrder._id} purchaseOrder={purchaseOrder}/>)}
                    />
                    {loading && (
                        <div className="flex justify-center items-center p-4">
                            <CircularProgress />
                        </div>
                    )}
                </div>
            </Card>
        
        </PageContainer>
    )
}

export default PurchaseOrdersPage