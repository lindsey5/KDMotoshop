import PageContainer from "../../components/containers/admin/PageContainer";
import BreadCrumbs from "../../components/BreadCrumbs";
import { Title } from "../../components/text/Text";
import Card from "../../components/cards/Card";
import { SearchField } from "../../components/Textfield";
import usePagination from "../../hooks/usePagination";
import { useEffect, useState } from "react";
import { fetchData } from "../../services/api";
import CustomizedTable from "../../components/tables/Table";
import { AdminsTableColumns, AdminsTableRow } from "../../components/tables/AdminsTable";
import { RedButton } from "../../components/buttons/Button";
import CreateAdminModal from "../../components/modals/CreateAdminModal";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Admins', href: '/admin/admins' },
]

const Admins = () => {
    const { pagination, setPagination } = usePagination();
    const [adminData, setAdminData] = useState<Admin | undefined>();
    const [showAdmin, setShowAdmin] = useState<boolean>(false);
    const { user } = useSelector((state : RootState) => state.user)
    const [admins, setAdmins] = useState<Admin[]>([]);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            const response = await fetchData(`/api/admins/all?&search=${pagination.searchTerm}`);
            if(response.success) {
                setAdmins(response.admins);
                setPagination(prev => ({...prev, totalPages: response.totalPages }));
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm]);

    const handleClose = () => {
        setShowAdmin(false);
        setAdminData(undefined);
    }

    const openModal =(admin : Admin) => {
        setAdminData(admin)
        setShowAdmin(true)
    }

    if(user && user.role !== 'Super Admin'){
        return <Navigate to="/admin/dashboard"/>
    }

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <CreateAdminModal 
                open={showAdmin} 
                close={handleClose}
                adminData={adminData}
            />
            <div className="flex items-start justify-between"> 
                <div>
                    <Title className="mb-4">Admins</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <RedButton onClick={() => setShowAdmin(true)}>Create Admin</RedButton>
            </div>
            <Card className="flex-grow min-h-0 flex flex-col gap-5 p-5">
                <SearchField 
                    sx={{ width: '400px'}}
                    onChange={(e) => setPagination(prev => ({...prev, searchTerm: e.target.value }))}
                    placeholder="Search by Email, Firstname, Lastname..."
                />
                <CustomizedTable 
                    cols={<AdminsTableColumns />}  
                    rows={admins.map(admin => <AdminsTableRow key={admin._id} openModal={openModal} admin={admin}/>)}
                />
            </Card>
        </PageContainer>
    )
}

export default Admins;