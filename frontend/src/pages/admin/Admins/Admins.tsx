import PageContainer from "../ui/PageContainer";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { Title } from "../../../components/text/Text";
import Card from "../../../components/Card";
import { SearchField } from "../../../components/Textfield";
import { useState } from "react";
import CustomizedTable from "../../../components/Table";
import { RedButton } from "../../../components/buttons/Button";
import CreateAdminModal from "./ui/CreateAdminModal";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../features/store";
import useFetch from "../../../hooks/useFetch";
import { useDebounce } from "../../../hooks/useDebounce";
import UserAvatar from "../../ui/UserAvatar";
import { IconButton } from "@mui/material";
import useDarkmode from "../../../hooks/useDarkmode";
import EditIcon from '@mui/icons-material/Edit';

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Admins', href: '/admin/admins' },
]

const Admins = () => {
    const isDark = useDarkmode();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data } = useFetch(`/api/admins/all?&search=${searchDebounce}`)
    const [adminData, setAdminData] = useState<Admin | undefined>();
    const [showAdmin, setShowAdmin] = useState<boolean>(false);
    const { user } = useSelector((state : RootState) => state.user)

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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Email, Firstname, Lastname..."
                />
                <CustomizedTable 
                    cols={['Fullname', 'Email', 'Phone', 'Role', 'Created At', 'Actions']}  
                    rows={data?.admins.map((admin : Admin) => ({
                        'Fullname' : (
                            <div className="flex items-center gap-2">
                                <UserAvatar image={admin.image}/>
                                {admin.firstname} {admin.lastname}
                            </div>
                        ),
                        'Email' : admin.email,
                        'Phone' : admin.phone,
                        'Role' : admin.role,
                        'Created At' : admin.createdAt,
                        'Actions' : (
                            <IconButton onClick={() => openModal(admin)}>
                                <EditIcon sx={{ color: isDark ? 'white' : 'inherit'}}/>
                            </IconButton>
                        )
                    })) || []}
                />
            </Card>
        </PageContainer>
    )
}

export default Admins;