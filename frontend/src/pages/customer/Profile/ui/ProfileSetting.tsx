import { User, Mail, Save, Camera } from "lucide-react";
import FormInput from "./FormInput";
import UserAvatar from "../../../ui/UserAvatar";
import { RedButton } from "../../../../components/buttons/Button";
import { useRef, useState } from "react";
import { cn } from "../../../../utils/utils";
import { useDispatch } from "react-redux";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";
import { updateData } from "../../../../services/api";
import { setUser } from "../../../../features/user/userSlice";
import { Backdrop, CircularProgress } from "@mui/material";

const ProfileSettings = ({ customer, isDark }: { customer: Customer; isDark: boolean }) => {
    const [editedCustomer, setEditedCustomer] = useState<Customer>(customer);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setEditedCustomer(prev => ({
                ...prev,
                image: reader.result as string
            }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        if (
            await confirmDialog(
            "Save Profile Changes?",
            "Your updated information will be applied to your account.",
            isDark
            )
        ) {
            setLoading(true);

            const response = await updateData("/api/customers", editedCustomer);

            if (response.success) {
                dispatch(setUser({ ...editedCustomer, role: "Customer" }));
                await successAlert(
                    "Profile Updated",
                    "Your changes have been saved successfully.",
                    isDark
                );
            } else {
                await errorAlert(
                    "Update Failed",
                    "Something went wrong while saving your changes. Please try again.",
                    isDark
                );
            }

            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: 1 })}
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
                <div className="flex items-start justify-between mb-8">
                <div>
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Profile Settings</h2>
                    <p className={`${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        Update your personal information and profile picture
                    </p>
                </div>
                </div>

                {/* Profile Picture Section */}
                <div className={cn("flex items-center space-x-6 mb-8 p-6 bg-gray-100 rounded-xl", isDark && 'bg-[#2A2A2A]')}>
                    <div className="relative">
                        <UserAvatar sx={{ width: 60, height: 60 }} image={editedCustomer?.image} />
                        <button 
                            className="cursor-pointer absolute -bottom-2 -right-2 p-2 bg-red-500 rounded-xl text-white shadow-lg hover:bg-red-600 transition-colors"
                            onClick={triggerFileSelect}
                        >
                        <Camera size={14} />
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImage}
                        style={{ display: "none" }}
                    />
                    <div>
                        <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>Profile Picture</h3>
                        <button 
                            className="cursor-pointer text-sm text-red-500 hover:text-red-600 font-medium"
                            onClick={triggerFileSelect}
                        >
                        Upload new picture
                        </button>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput
                    label="First Name"
                    defaultValue={customer?.firstname}
                    isDark={isDark}
                    icon={<User size={18} />}
                    value={editedCustomer.firstname}
                    onChange={(value : string) => setEditedCustomer(prev => ({ ...prev, firstname: value}))}
                />
                <FormInput
                    label="Last Name"
                    defaultValue={customer?.lastname}
                    isDark={isDark}
                    icon={<User size={18} />}
                    value={editedCustomer.lastname}
                    onChange={(value : string) => setEditedCustomer(prev => ({ ...prev, lastname: value}))}
                />
                <FormInput
                    label="Email Address"
                    type="email"
                    defaultValue={customer?.email}
                    isDark={isDark}
                    disabled
                    value={editedCustomer.email}
                    icon={<Mail size={18} />}
                    onChange={(value : string) => setEditedCustomer(prev => ({ ...prev, email: value}))}
                />
                </div>

                {/* Action Buttons */}
                <div className={cn("flex justify-end mt-8 pt-6 border-t border-neutral-300", isDark && 'border-gray-700')}>
                <div className="flex space-x-3">
                    <button
                        className={`px-6 py-3 rounded-xl transition-colors ${
                            isDark
                            ? "bg-[#313131] cursor-pointer text-slate-300 hover:text-white"
                            : "bg-neutral-100 text-slate-600 hover:text-slate-900"
                        }`}
                        onClick={() => setEditedCustomer(customer)}
                    >
                    Cancel
                    </button>
                    <RedButton 
                        onClick={handleSave} 
                        sx={{ textTransform: "none" }} 
                        startIcon={<Save size={18}/>}
                    >Save Changes</RedButton>
                </div>
                </div>
            </div>
        </div>
  );
};

export default ProfileSettings;
