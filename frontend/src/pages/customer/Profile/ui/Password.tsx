import { Backdrop, CircularProgress } from "@mui/material";
import useDarkmode from "../../../../hooks/useDarkmode"
import { useState } from "react";
import { RedButton } from "../../../../components/buttons/Button";
import { cn } from "../../../../utils/utils";
import { CheckCircle, Lock, Save, } from "lucide-react";
import FormInput from "./FormInput";
import { confirmDialog, successAlert } from "../../../../utils/swal";
import { updateData } from "../../../../services/api";


const Password = () => {
    const isDark = useDarkmode();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState('');
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const handleSave = async () => {
        if(await confirmDialog('Change Password', 'Are you sure you want to change your password?', isDark)){
            setLoading(true)
            if (passwords.newPassword !== passwords.confirmNewPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            const response = await updateData('/api/customers/password', { newPassword: passwords.newPassword, currentPassword: passwords.currentPassword });
            setLoading(false);
            if(!response.success){
                setError(response.message || 'Failed to change password')
                return;
            }

            await successAlert('Success', response.message);
            window.location.reload();
        }
    }

    return (
        <div className="max-w-4xl">
            <Backdrop
                sx={{ color: '#fff', zIndex: 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Profile Settings Card */}
            <div
                className={`${
                isDark ? "bg-[#121212] border-gray-700" : "bg-white border-neutral-200"
                } rounded-2xl border p-8 mb-8`}
            >
                <div className="mb-8">
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Change Your Password</h2>
                    <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Keep your account secure by setting a strong, unique password.
                    </p>
                    <p className="text-red-600 my-2">{error}</p>
                </div>
                <div className="space-y-8">
                    <FormInput
                        label="Current Password"
                        defaultValue={passwords.currentPassword}
                        isDark={isDark}
                        type="password"
                        icon={<Lock size={18} />}
                        value={passwords.currentPassword}
                        maxLength={64}
                        onChange={(value : string) => setPasswords(prev => ({ ...prev, currentPassword: value}))}
                    />

                    <FormInput
                        label="New Password"
                        defaultValue={passwords.newPassword}
                        isDark={isDark}
                        type="password"
                        icon={<Lock size={18} />}
                        value={passwords.newPassword}
                        maxLength={64}
                        onChange={(value : string) => setPasswords(prev => ({ ...prev, newPassword: value}))}
                    />
                    
                    <FormInput
                        label="Confirm New Password"
                        defaultValue={passwords.confirmNewPassword}
                        type="password"
                        isDark={isDark}
                        icon={<CheckCircle size={18} />}
                        value={passwords.confirmNewPassword}
                        maxLength={64}
                        onChange={(value : string) => setPasswords(prev => ({ ...prev, confirmNewPassword: value}))}
                    />
                </div>

                {/* Action Buttons */}
                <div className={cn("flex justify-end mt-8 pt-6 border-t border-neutral-300", isDark && 'border-gray-700')}>
                <div className="flex space-x-3">
                    <RedButton 
                        onClick={handleSave} 
                        sx={{ textTransform: "none" }} 
                        startIcon={<Save size={18}/>}
                    >Save Changes</RedButton>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Password