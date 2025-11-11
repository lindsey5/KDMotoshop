import { useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import PageContainer from "../ui/PageContainer"
import { CustomizedSelect } from "../../../components/Select"
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import useFetch from "../../../hooks/useFetch"
import Card from "../../../components/Card"
import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import UserAvatar from "../../ui/UserAvatar"
import { RefundStatusChip } from "../../../components/Chip"
import { formatNumberToPeso } from "../../../utils/utils"
import { formatDate } from "../../../utils/dateUtils"
import RefundRequestModal from "./ui/RefundRequestModal"
import useDarkmode from "../../../hooks/useDarkmode";
import CustomizedPagination from "../../../components/Pagination";
import { useDebounce } from "../../../hooks/useDebounce";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Refunds', href: '/admin/refunds' },
]

const RefundsPage = () => {
    const isDark = useDarkmode();
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [status, setStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const { data : refundRequests, loading } = useFetch(`/api/refunds?limit=30&status=${status}&searchTerm=${searchDebounce}&page=${page}`);

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    return (
        <PageContainer className="flex flex-col gap-5"> 
            {selectedRefund && <RefundRequestModal open={true} close={() => setSelectedRefund(null)} refundRequest={selectedRefund as RefundRequest}/>}
            <Title>Refund Requests</Title>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                <div className="w-[300px]">
                    <CustomizedSelect 
                        label="Status"
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value as string)
                            setPage(1)
                        }}
                        menu={['All', 'Pending', 'Under Review', 'Approved', 'Processing', 'Refunded', 'Cancelled'].map(method => ({ value: method, label: method }))}
                    />
                </div>
            </div>
            <Card className="h-screen flex flex-col overflow-y-auto">
                <input 
                    type="text"
                    className="border px-3 py-2 mb-5 w-full md:w-1/2"
                    placeholder="Search by Order ID, Firstname, Lastname, or Product Name"
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setPage(1)
                    }}
                />
                <CustomizedTable 
                    cols={['Customer Name', 'Order ID', 'Product Name', 'Quantity', 'Status', 'Total Amount', 'Request Date', 'Action']}
                    rows={refundRequests?.refundRequests.map((request : RefundRequest) => ({
                        'Customer Name' : (
                            <div className="flex items-center gap-2">
                                <UserAvatar image={request.customer_id.image.imageUrl}/>
                                {request.customer_id.firstname} {request.customer_id.lastname}
                            </div>
                        ),
                        'Order ID' : request.order_item_id.order_id.order_id,
                        'Product Name' : request.order_item_id.product_id.product_name,
                        'Quantity' : request.quantity,
                        'Status' : <RefundStatusChip status={request.status} />,
                        'Total Amount' : formatNumberToPeso(request.totalAmount),
                        'Request Date' : formatDate(request.createdAt),
                        'Action' : (
                            <Tooltip title="View" followCursor>
                                <IconButton onClick={() => setSelectedRefund(request)} sx={{ color: isDark ? 'white' : 'black'}}>
                                    <VisibilityIcon />
                                </IconButton>
                            </Tooltip>
                        )
                    })) || []}
                />
                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
            </Card>
            <div className="flex justify-end mt-4">
                <CustomizedPagination count={refundRequests?.totalPages} page={page} onChange={handlePage} />
            </div>
        </PageContainer>
    )
}

export default RefundsPage