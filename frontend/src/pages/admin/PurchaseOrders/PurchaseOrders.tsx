import { useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { RedButton } from "../../../components/buttons/Button"
import Card from "../../../components/Card"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import { SearchField } from "../../../components/Textfield"
import useFetch from "../../../hooks/useFetch"
import PageContainer from "../ui/PageContainer"
import { CircularProgress, IconButton } from "@mui/material"
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom"
import { formatNumberToPeso } from "../../../utils/utils"
import { formatDate } from "../../../utils/dateUtils"
import { POStatusChip } from "../../../components/Chip"
import useDarkmode from "../../../hooks/useDarkmode"
import { useDebounce } from "../../../hooks/useDebounce"
import CustomizedPagination from "../../../components/Pagination"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Purchase Orders', href: '/admin/purchase-orders' },
]

const PurchaseOrdersPage = () => {
    const isDark = useDarkmode();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState(1);
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data, loading } = useFetch(`/api/purchase-orders?limit=50&page=${page}&searchTerm=${searchDebounce}`)
    const navigate = useNavigate();

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Title>Purchase Orders</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="min-h-0 flex-grow flex flex-col gap-5">
                <div className="flex gap-10 justify-between items-center">
                    <SearchField 
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setPage(1)
                        }} 
                        sx={{ maxWidth: '350px'}} 
                        placeholder="Search purchase order"
                    />
                    <RedButton onClick={() => navigate('/admin/purchase-order')}>Create Purchase Order</RedButton>
                </div>
                <div className="min-h-0 flex-grow overflow-y-auto">
                    <CustomizedTable
                        cols={['PO ID', 'Supplier Name', 'Total Items', 'Total Amount', 'Order Date', 'Received Date', 'Status', 'Action']}
                        rows={data?.purchaseOrders.map((purchaseOrder : PurchaseOrder) => ({
                            'PO ID' : purchaseOrder.po_id,
                            'Supplier Name' : purchaseOrder.supplier.name,
                            'Total Items' : purchaseOrder.purchase_items.length,
                            'Total Amount' : formatNumberToPeso(purchaseOrder.totalAmount),
                            'Order Date' : formatDate(purchaseOrder.createdAt),
                            'Received Date' : purchaseOrder.receivedDate ? formatDate(purchaseOrder.receivedDate) : 'N/A',
                            'Status' : <POStatusChip status={purchaseOrder.status} />,
                            'Action' : (
                                <IconButton onClick={() => window.location.href = `/admin/purchase-order/${purchaseOrder._id}`}>
                                    <VisibilityIcon sx={{ color: isDark ? 'white' : ''}}/>
                                </IconButton>
                            )
                        })) || []}
                    />
                    {loading && (
                        <div className="flex justify-center items-center p-4">
                            <CircularProgress />
                        </div>
                    )}
                </div>
            </Card>
            <div className="flex justify-end">
                <CustomizedPagination count={data?.totalPages} page={page} onChange={handlePage} />
            </div>
        
        </PageContainer>
    )
}

export default PurchaseOrdersPage