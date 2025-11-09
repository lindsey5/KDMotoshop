import { Modal } from "@mui/material";
import { memo, useEffect, useState } from "react";
import Card from "../../../../components/Card";
import { RedTextField } from "../../../../components/Textfield";
import { RedButton } from "../../../../components/buttons/Button";
import useDarkmode from "../../../../hooks/useDarkmode";
import { postData, updateData } from "../../../../services/api";
import { errorAlert } from "../../../../utils/swal";

interface CreateAdminModalProps extends ModalProps {
    adminData: Admin | undefined;
}

const CreateAdminModal = ({ open, close, adminData } : CreateAdminModalProps) => {    
    const [admin, setAdmin] = useState<Admin | undefined>();
    const [loading, setLoading] = useState(false);
    const isDark = useDarkmode();

    useEffect(() => {
        setAdmin(adminData)
    }, [adminData])

    const handleSave = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if(admin?.password !== admin?.confirmPassword) {
            errorAlert('Error', 'Passwords do not match', isDark);
        }else if((admin?.email ?? '').length < 5 || !admin?.email.includes('@')) {
            errorAlert('Error', 'Invalid email address', isDark);
        }else if(admin?.firstname.length < 2 || admin?.lastname.length < 2) {
            errorAlert('Error', 'First name and last name must be at least 2 characterslong', isDark);
        }else if(admin.lastname.length < 2) {
            errorAlert('Error', 'Last name must be at least 2 characters long', isDark);    
        }else { 
            const { confirmPassword, ...rest } = admin;
            const response = admin._id ? await updateData(`/api/admins/${adminData?._id}`, rest) : await postData('/api/admins', rest);
            response.success ? window.location.reload() : errorAlert('Error', response.message);
        }
        setLoading(false);
    }

    return (
        <Modal 
            open={open}
            onClose={close}
            aria-labelledby="create-admin-modal-title"
            aria-describedby="create-admin-modal-description"
            sx={{
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Card>
                <h2 className="text-2xl font-bold mb-4">{admin?._id ? 'Edit Admin' : 'Create Admin'}</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSave}>
                    {/* Form fields for admin data */}
                    <RedTextField 
                        label="Email" 
                        value={admin?.email || ''} 
                        onChange={(e) => setAdmin(prev => ({ ...prev!, email: e.target.value }))}
                        required
                        type="Email"
                        inputProps={{ maxLength: 100 }}
                    />
                    <div className="flex gap-4">
                        <RedTextField 
                            label="First Name" 
                            value={admin?.firstname || ''} 
                            onChange={(e) => setAdmin(prev => ({ ...prev!, firstname: e.target.value }))}
                            required
                            inputProps={{ maxLength: 100 }}
                        />
                        <RedTextField 
                            label="Last Name" 
                            value={admin?.lastname || ''} 
                            onChange={(e) => setAdmin(prev => ({ ...prev!, lastname: e.target.value }))}
                            required
                            inputProps={{ maxLength: 100 }}
                        />
                    </div>
                    <RedTextField 
                        label="Password"
                        type="password"
                        value={admin?.password || ''}
                        onChange={(e) => setAdmin(prev => ({ ...prev!, password: e.target.value }))}
                        required={!admin?._id}
                        inputProps={{ maxLength: 30 }}
                    />

                    <RedTextField 
                        label="Confirm Password"
                        type="password"
                        value={admin?.confirmPassword || ''}
                        onChange={(e) => setAdmin(prev => ({ ...prev!, confirmPassword: e.target.value }))}
                        required={!admin?._id}
                        inputProps={{ maxLength: 30 }}
                    />

                    <RedTextField 
                    label="Phone"
                    type="number"
                    value={admin?.phone || ''}
                    onChange={(e) => {
                        const value = e.target.value.slice(0, 11);
                        setAdmin(prev => ({ ...prev!, phone: value }));
                    }}
                    required
                    placeholder="09 XXX XXX XXX"
                    />
                
                    {/* Add more fields as necessary */}
                    <div className="flex justify-end gap-4">
                        <RedButton onClick={close} disabled={loading}>Cancel</RedButton>
                        <RedButton disabled={loading} type="submit">
                            {loading ? 'Saving...' : 'Save'}
                        </RedButton>
                    </div>
                </form>

            </Card>

        </Modal>
    )

}

export default memo(CreateAdminModal);