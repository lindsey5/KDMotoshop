import { useState } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs"
import { RedButton } from "../../../components/buttons/Button"
import Card from "../../../components/Card"
import CustomizedTable from "../../../components/Table"
import { Title } from "../../../components/text/Text"
import { SearchField } from "../../../components/Textfield"
import useFetch from "../../../hooks/useFetch"
import PageContainer from "../ui/PageContainer"
import EditIcon from '@mui/icons-material/Edit';
import SupplierModal from "./ui/SupplierModal"
import { CircularProgress, IconButton, Tooltip } from "@mui/material"
import { useDebounce } from "../../../hooks/useDebounce"
import useDarkmode from "../../../hooks/useDarkmode"
import { CustomizedSelect } from "../../../components/Select"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Refunds', href: '/admin/suppliers' },
]

const SuppliersPage = () => {
    const isDark = useDarkmode();
    const [status, setStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data, loading } = useFetch(`/api/suppliers?searchTerm=${searchDebounce}&status=${status}`)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier>();
    const [openModal, setOpenModal] = useState(false);

    const closeModal = () => {
        setSelectedSupplier(undefined);
        setOpenModal(false);
    }

    const handleEdit = (supplier : Supplier) => {
        setOpenModal(true);
        setSelectedSupplier(supplier)
    }

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <SupplierModal close={closeModal} open={openModal} supplier={selectedSupplier}/>
            <div className="flex justify-between items-center">
            <div className="space-y-4">
                <Title>Suppliers</Title>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>
            <RedButton onClick={() => setOpenModal(true)}>Add Supplier</RedButton>
            </div>
            <Card className="min-h-0 flex-grow flex flex-col gap-5">
                <div className="flex gap-10 justify-between items-center">
                    <SearchField onChange={(e) => setSearchTerm(e.target.value)} sx={{ maxWidth: '350px'}} placeholder="Search supplier"/>
                    <div className="w-[400px]">
                        <CustomizedSelect 
                            sx={{ height: 55 }}
                            label="Status"
                            menu={['All', 'Active', 'Inactive'].map(status => ({ label: status, value: status }))}
                            value={status}
                            fullWidth
                            onChange={(e) => setStatus(e.target.value as string)}
                        />
                    </div>
                </div>
                <div className="min-h-0 flex-grow overflow-y-auto">
                    <CustomizedTable
                        cols={['Supplier Name', 'Email', 'Phone', 'Status', 'Action']}
                        rows={data?.suppliers.map((supplier : Supplier) => ({
                            'Supplier Name' : supplier.name,
                            'Email' : supplier.email,
                            'Phone' : supplier.phone,
                            'Status' : <span className={`px-3 py-1 rounded-full text-xs font-semibold ${supplier.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>{supplier.status}</span>,
                            'Action' : (
                                <Tooltip title="Edit Supplier">
                                <IconButton onClick={() => handleEdit(supplier)}>
                                    <EditIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
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
                </div>
            </Card>
        
        </PageContainer>
    )
}

export default SuppliersPage