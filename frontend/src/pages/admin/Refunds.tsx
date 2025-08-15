import { useEffect, useState } from "react"
import BreadCrumbs from "../../components/BreadCrumbs"
import PageContainer from "../../components/containers/admin/PageContainer"
import { RefundsTableColumns, RefundsTableRow } from "../../components/tables/RefundsTable"
import CustomizedTable from "../../components/tables/Table"
import { Title } from "../../components/text/Text"
import { fetchData } from "../../services/api"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Refunds', href: '/admin/refunds' },
]

const RefundsPage = () => {
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    useEffect(() => {
        const getRefunds = async () => {
            const response = await fetchData('/api/refunds');
            if(response.success){
                setRefundRequests(response.refundRequests);
            }
        }

        getRefunds()
    }, [])

    return (
        <PageContainer className="h-full flex flex-col gap-5">
             <Title>Refund Requests</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <CustomizedTable 
                cols={<RefundsTableColumns />}
                rows={refundRequests.map(request => <RefundsTableRow key={request._id} request={request}/>)}
            />
        </PageContainer>
    )
}

export default RefundsPage