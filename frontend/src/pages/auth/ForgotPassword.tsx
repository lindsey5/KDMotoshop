import { motion } from "framer-motion";
import useDarkmode from "../../hooks/useDarkmode";
import { cn } from "../../utils/utils";
import { useState } from "react";
import { RedTextField } from "../../components/Textfield";
import { RedButton } from "../../components/buttons/Button";
import { postData } from "../../services/api";
import { successAlert } from "../../utils/swal";
import { Check } from "lucide-react";

const ForgotPassword = () => {
    const isDark = useDarkmode();
    const [email, setEmail] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const response = await postData("/api/auth/forgot-password", { email });
        setLoading(false);

        if (!response.success) {
        setError(response.message || "Failed to send reset email");
        return;
        }

        setSuccess(true);
        await successAlert("Email Sent", "We’ve sent a password reset link to your email. Please check your inbox.");
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
                    <h1 className="font-bold text-4xl">Forgot Password</h1>

                    {!success ? (
                    <>
                        <p className={cn(isDark ? "text-gray-200" : "text-gray-400")}>Enter your email address below and we’ll send you a link to reset your password.</p>
                        <p className="text-red-500">{error}</p>
                        <RedTextField
                            placeholder="Email"
                            type="email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            inputProps={{ maxLength: 100 }}
                        />
                        <RedButton
                            disabled={loading}
                            type="submit"
                            sx={{ paddingY: 1, marginTop: 2 }}
                            fullWidth
                        >
                        {loading ? "Sending..." : "Reset Password"}
                        </RedButton>
                        <div className="w-full flex justify-center mt-4">
                            <p className={cn("text-lg", isDark && "text-gray-400")}>Remember your password?{" "}
                                <a className={cn("text-red-600 hover:underline font-semibold", isDark && "text-white")} href="/login">Login</a>
                            </p>
                        </div>
                    </>
                    ) : (
                    <div className="w-full flex flex-col gap-5 items-center text-center mt-5">
                        <Check className="w-16 h-16 text-white bg-green-500 rounded-full p-3" />
                        <h2 className="text-2xl font-semibold">Email Sent Successfully!</h2>
                        <p className={cn("text-gray-500 max-w-sm", isDark && "text-gray-300")}>
                        We’ve sent a password reset link to <span className="font-medium text-red-600">{email}</span>.
                        Please check your inbox and follow the instructions to reset your password.
                        </p>
                        <a href="/login" className={cn("semibold  text-lg mt-3 text-red-600 hover:underline font-semibold", isDark && "text-white")}>Back to Login
                        </a>
                    </div>
                    )}
                </div>
            </div>
        </form>
        </div>
    );
};

export default ForgotPassword;
