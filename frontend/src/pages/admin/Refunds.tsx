import { useEffect, useState } from "react"
import BreadCrumbs from "../../components/BreadCrumbs"
import PageContainer from "../../components/containers/admin/PageContainer"
import { CustomizedSelect } from "../../components/Select"
import { RefundsTableColumns, RefundsTableRow } from "../../components/tables/RefundsTable"
import CustomizedTable from "../../components/tables/Table"
import { Title } from "../../components/text/Text"
import useFetch from "../../hooks/useFetch"
import Card from "../../components/cards/Card"
import { CircularProgress } from "@mui/material"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Refunds', href: '/admin/refunds' },
]

const RefundsPage = () => {
    const [status, setStatus] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { data : refundRequests, loading } = useFetch(`/api/refunds?status=${status}&searchTerm=${searchTerm}`);

    useEffect(() => {
        const debounce = setTimeout(() => {
            setSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchTerm])

    return (
        <PageContainer className="flex flex-col gap-5"> 
             <Title>Refund Requests</Title>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                <div className="w-[300px]">
                    <CustomizedSelect 
                        label="Status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as string)}
                        menu={['All', 'Pending', 'Under Review', 'Approved', 'Processing', 'Completed', 'Cancelled'].map(method => ({ value: method, label: method }))}
                    />
                </div>
            </div>
            <Card className="h-screen flex flex-col overflow-y-auto">
                <input 
                    type="text"
                    className="border px-3 py-2 mb-5 w-full md:w-1/2"
                    placeholder="Search by Order ID, Firstname, Lastname, or Product Name"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <CustomizedTable 
                    cols={<RefundsTableColumns />}
                    rows={refundRequests?.refundRequests.map((request : RefundRequest) => <RefundsTableRow key={request._id} request={request}/>)}
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

export default RefundsPage