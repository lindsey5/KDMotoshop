import { useEffect, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import Card from "../../../components/Card";
import CustomizedPagination from "../../../components/Pagination";
import CustomizedTable from "../../../components/Table";
import { Title } from "../../../components/text/Text";
import { SearchField } from "../../../components/Textfield";
import useFetch from "../../../hooks/useFetch";
import usePagination from "../../../hooks/usePagination";
import PageContainer from "../ui/PageContainer"
import { CustomersTableColumns, CustomersTableRow } from "./ui/CustomersTable";
import { CircularProgress } from "@mui/material";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Customers', href: '/admin/customers' },
]

const CustomersPage = () => {
    const { setPagination, pagination } = usePagination();
    const { data : customersRes, loading } = useFetch(`/api/customers/all?page=${pagination.page}&searchTerm=${pagination.searchTerm}&limit=20`)
    const [searchTerm, setSearchTerm] = useState<string>('');

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPagination(prev => ({...prev, searchTerm }));
        }, 300); 
            
    return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Title className="mb-4">Customers</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="flex-grow min-h-0 flex flex-col gap-5 p-5">
                <SearchField 
                    sx={{ width: '400px'}}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Email, Firstname, Lastname..."
                />
                <CustomizedTable 
                    cols={<CustomersTableColumns />}  
                    rows={customersRes?.customers.map((customer : Customer) => <CustomersTableRow customer={customer}/>)}
                />
                {loading && (
                    <div className="flex justify-center items-center p-4">
                        <CircularProgress />
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <CustomizedPagination count={customersRes?.totalPages} page={customersRes?.page} onChange={handlePage} />
                </div>
            </Card>
        </PageContainer>
    )
}

export default CustomersPage;