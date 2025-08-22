import BreadCrumbs from "../../components/BreadCrumbs"
import PageContainer from "../../components/containers/admin/PageContainer"
import { RefundsTableColumns, RefundsTableRow } from "../../components/tables/RefundsTable"
import CustomizedTable from "../../components/tables/Table"
import { Title } from "../../components/text/Text"
import useFetch from "../../hooks/useFetch"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Refunds', href: '/admin/refunds' },
]

const RefundsPage = () => {
    const { data : refundRequests } = useFetch('/api/refunds');
    console.log(refundRequests)
    return (
        <PageContainer className="h-full flex flex-col gap-5">
             <Title>Refund Requests</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <CustomizedTable 
                cols={<RefundsTableColumns />}
                rows={refundRequests?.refundRequests.map((request : RefundRequest) => <RefundsTableRow key={request._id} request={request}/>)}
            />
        </PageContainer>
    )
}

export default RefundsPage