import { useEffect, useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { RedButton } from "../../../components/buttons/Button"
import Card from "../../../components/Card"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import { SearchField } from "../../../components/Textfield"
import useFetch from "../../../hooks/useFetch"
import PageContainer from "../ui/PageContainer"
import { SuppliersTableColumns, SupplierTableRow } from "./ui/SuppliersTable"
import SupplierModal from "./ui/SupplierModal"
import usePagination from "../../../hooks/usePagination"
import { CircularProgress } from "@mui/material"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Refunds', href: '/admin/suppliers' },
]

const SuppliersPage = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { pagination, setPagination } = usePagination(); 
    const { data, loading } = useFetch(`/api/suppliers?searchTerm=${searchTerm}`)
    const [openSupplier, setOpenSupplier] = useState<boolean>(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setSearchTerm(pagination.searchTerm)
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm]);

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <SupplierModal close={() => setOpenSupplier(false)} open={openSupplier} />
            <Title>Suppliers</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="min-h-0 flex-grow flex flex-col gap-5">
                <div className="flex gap-10 justify-between items-center">
                    <SearchField onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value}))} sx={{ maxWidth: '350px'}} placeholder="Search supplier"/>
                    <RedButton onClick={() => setOpenSupplier(true)}>Add Supplier</RedButton>
                </div>
                <div className="min-h-0 flex-grow overflow-y-auto">
                    <CustomizedTable
                        cols={<SuppliersTableColumns />}
                        rows={data?.suppliers.map((supplier : Supplier) => <SupplierTableRow key={supplier._id} supplier={supplier}/>)}
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

export default SuppliersPage