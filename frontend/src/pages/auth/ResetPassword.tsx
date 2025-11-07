import { motion } from "framer-motion";
import useDarkmode from "../../hooks/useDarkmode";
import { cn } from "../../utils/utils";
import { useState } from "react";
import { postData } from "../../services/api";
import { successAlert } from "../../utils/swal";
import { useParams } from "react-router-dom";
import { PasswordField } from "../../components/Textfield";
import { RedButton } from "../../components/buttons/Button";

const ResetPassword = () => {
    const isDark = useDarkmode();
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const response = await postData(`/api/auth/reset-password/${token}`, { newPassword });
        setLoading(false);

        if (!response.success) {
            setError(response.message || "Failed to reset password");
            return;
        } 
        await successAlert("Success!", response.message);
        window.location.href = '/login'
    };

    return (
        <div className={cn("min-h-screen bg-white flex flex-col gap-3 px-5 py-25", isDark && "bg-[#1e1e1e]")}>
        <form className="flex-1 w-full lg:grid grid-cols-[1fr_1fr] gap-10" onSubmit={handleSubmit}>
            {/* Left Images */}
            <div className="p-5 relative hidden lg:block">
            <motion.img
                className="z-1 absolute w-1/2 h-[45%] left-10 top-20 rounded-xl"
                src="/helmet.png"
                alt="helmet"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            />
            <motion.img
                className="absolute w-1/2 h-[45%] bottom-20 right-5 rounded-xl"
                src="/evo.webp"
                alt="helmet"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            />
            </div>

            {/* Right Form */}
            <div className="flex-grow flex justify-center items-center">
                <div
                    className={cn(
                    "w-full flex flex-col items-start gap-5 lg:w-[500px] 2xl:w-[600px]",
                    isDark && "text-white"
                    )}
                >
                    <h1 className="font-bold text-4xl">Reset Password</h1>
                    <p className={cn(isDark ? "text-gray-200" : "text-gray-400")}>Please enter your new password.</p>
                    <p className="text-red-500">{error}</p>
                    <PasswordField 
                        placeholder="New Password" 
                        required
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        inputProps={{ maxLength: 64 }}
                    />
                    <PasswordField 
                        placeholder="Confirm New Password" 
                        required
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        value={confirmNewPassword}
                        inputProps={{ maxLength: 64 }}
                    />
                    <RedButton
                        disabled={loading}
                        type="submit"
                        sx={{ paddingY: 1, marginTop: 2 }}
                        fullWidth
                    >Reset My Password</RedButton>
                </div>
            </div>
        </form>
        </div>
    );
};

export default ResetPassword;
