import BreadCrumbs from "../../components/BreadCrumbs"
import { Title } from "../../components/text/Text"
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils"
import UserAvatar from "../../components/images/UserAvatar"
import React, { useContext, useState} from "react"
import { AdminContext } from "../../context/AdminContext"
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { Backdrop, Button, CircularProgress } from "@mui/material"
import { RedTextField } from "../../components/Textfield"
import PhoneInput from "react-phone-input-2"
import { confirmDialog, errorAlert } from "../../utils/swal"
import { RedButton } from "../../components/Button"
import { updateData } from "../../services/api"
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import HistoryIcon from '@mui/icons-material/History';
import PageContainer from "../../components/containers/admin/PageContainer"

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Settings', href: '/admin/settings' },
]

const Settings = () => {
    const isDark = useDarkmode()
    const { admin } = useContext(AdminContext);
    const [updatedAdmin, setUpdatedAdmin] = useState<Admin | null>(admin);
    const [loading, setLoading] = useState<boolean>(false);

    const handleAdminImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUpdatedAdmin({...updatedAdmin!, image: reader.result})
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (field : string, value : string) => {
        setUpdatedAdmin(prev => ({...prev!, [field]: value}))
    }

    const handleSave = async(e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(await confirmDialog('Are you sure you want to save changes?', 'Your updated profile information will be saved.', isDark)){
            setLoading(true)
            const response = await updateData('/api/admin', updatedAdmin)
            if(response.success) window.location.reload()
            else errorAlert('Error', response.message, isDark)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSave}>
        <PageContainer className="flex flex-col h-full">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Title className="mb-4">Personal Info</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <div className="flex py-5 items-end justify-between">
                <div className="flex flex-col gap-5 items-center">
                    <UserAvatar
                        sx={{ width: '120px', height: '120px'}}
                        image={updatedAdmin?.image}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        id="admin-image-input"
                        style={{ display: 'none' }}
                        onChange={handleAdminImage}
                    />
                    <label htmlFor="admin-image-input">
                        <Button 
                            component="span"
                            sx={{ color: isDark ? 'white' : 'red', background: isDark ? '#1e1e1e' : 'white', borderRadius: '20px'}}
                            variant="contained"
                            startIcon={<InsertPhotoOutlinedIcon/>}
                        >Upload Image</Button>
                    </label>
                </div>
                <div className="flex gap-5">
                    <Button sx={{ color: isDark ? 'white' : 'red' }} startIcon={<LockOutlineIcon/>}>Change Password</Button>
                    <Button sx={{ color: isDark ? 'white' : 'red' }} startIcon={<HistoryIcon/>}>My Activity</Button>
                </div>
            </div>
            <div className={cn("py-10 grid grid-cols-2 gap-x-20 gap-y-5 border-t border-gray-300", isDark && "border-gray-500")}>
                <RedTextField 
                    label="Firstname" 
                    value={updatedAdmin?.firstname}
                    required
                    onChange={(e) => handleChange('firstname', e.target.value) }
                />
                <RedTextField 
                    label="Lastname" 
                    value={updatedAdmin?.lastname}
                    required
                    onChange={(e) => handleChange('lastname', e.target.value) }
                />

                <RedTextField 
                    label="Email" 
                    value={updatedAdmin?.email}
                    type="email"
                    required
                    onChange={(e) => handleChange('email', e.target.value) }
                />
                <PhoneInput
                    country={'ph'}
                    onlyCountries={['ph']}
                    specialLabel="Phone"
                    value={updatedAdmin?.phone || ''}
                    dropdownStyle={{ color: 'black'}}
                    containerStyle={{ width: '100%', height: '55px', color: isDark ? 'gray' : 'black'  }}
                    inputStyle={{
                        width: '100%',
                        height: '55px',
                        backgroundColor: isDark ? '#313131' : '#fff',
                        color: isDark ? 'white' : 'black',
                    }}
                    onChange={(value) => setUpdatedAdmin((prev) => ({ ...prev!, phone: value}))}
                />
            </div>
            <div className="flex justify-between">
                <RedButton type="submit">Save Changes</RedButton>
            </div>
        </PageContainer>
        </form>
    )
}

export default Settings