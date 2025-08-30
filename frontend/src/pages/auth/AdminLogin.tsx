import { useState } from "react"
import { LineTextField } from "../../components/Textfield"
import { RedButton } from "../../components/buttons/Button";
import { postData } from "../../services/api";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import useDarkmode from "../../hooks/useDarkmode";
import { cn } from "../../utils/utils";
import { Title } from "../../components/text/Text";
import { ThemeToggle } from "../../components/Toggle";

const AdminLogin = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const isDark = useDarkmode()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('')
        const response = await postData('/api/auth/admin/login', { email, password });
        if(response.success){
            window.location.href = '/admin/dashboard'
        }else{
            setError(response.message || response)
        }
    };

    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)
    if (user && user.role === 'Customer' && !userLoading) {
        return <Navigate to="/" />;
    }

    if(user && (user.role === 'Admin' || user.role === 'Super Admin') && !userLoading){
        return <Navigate to="/admin/dashboard" />;
    }

    return (
        <main className={cn(
            "h-screen relative overflow-hidden transition-colors duration-500",
            isDark 
                ? "bg-gradient-to-br from-black via-red-950 to-gray-900" 
                : "bg-gradient-to-br from-white via-red-50 to-red-100"
        )}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className={cn(
                    "absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse",
                    isDark ? "bg-red-600" : "bg-red-300"
                )} />
                <div className={cn(
                    "absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 animate-pulse",
                    isDark ? "bg-red-500" : "bg-red-400"
                )} style={{ animationDelay: "1s" }} />
                <div className={cn(
                    "absolute top-1/2 left-1/4 w-32 h-32 rounded-full opacity-10 animate-bounce",
                    isDark ? "bg-red-400" : "bg-red-200"
                )} style={{ animationDelay: "2s" }} />
            </div>

            {/* Theme toggle */}
            <div className="absolute top-6 right-6 z-20">
                <ThemeToggle />
            </div>

            <div className="relative z-10 h-full grid grid-cols-1 lg:grid-cols-2">
                {/* Left panel - Brand section */}
                <div className={cn(
                    "hidden lg:flex flex-col items-center justify-center p-12 relative",
                    isDark 
                        ? "bg-gradient-to-br from-red-950/30 via-black/60 to-gray-900/40 backdrop-blur-sm" 
                        : "bg-gradient-to-br from-white/80 via-red-50/60 to-white/90 backdrop-blur-sm border-r border-red-100"
                )}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className={cn(
                            "absolute top-20 left-20 w-2 h-2 rounded-full animate-ping",
                            isDark ? "bg-red-500" : "bg-red-400"
                        )} />
                        <div className={cn(
                            "absolute bottom-32 right-32 w-1 h-1 rounded-full animate-ping",
                            isDark ? "bg-red-400" : "bg-red-300"
                        )} style={{ animationDelay: "0.5s" }} />
                    </div>

                    <div className="text-center space-y-8 max-w-md">
                        <div className="space-y-4">
                            <h1 className={cn(
                                "text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-pulse",
                                isDark 
                                    ? "from-red-200 via-white to-gray-200" 
                                    : "from-red-600 via-red-800 to-gray-800"
                            )}>
                                Welcome
                            </h1>
                            <div className="flex justify-center">
                                <div className="bg-black p-6 rounded-2xl backdrop-blur-md border shadow-2xl">
                                    <img 
                                        className="w-48 h-32 object-contain filter drop-shadow-lg" 
                                        src="/kd-logo (1).png" 
                                        alt="logo" 
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className={cn(
                                "text-2xl font-semibold",
                                isDark ? "text-red-100" : "text-gray-800"
                            )}>
                                Admin Portal
                            </h2>
                            <p className={cn(
                                "text-lg",
                                isDark ? "text-gray-300" : "text-gray-600"
                            )}>
                                Ride better. Shop better.
                            </p>
                        </div>

                        {/* Stats or features */}
                        <div className="grid grid-cols-2 gap-4 mt-12">
                            <div className={cn(
                                "p-4 rounded-xl backdrop-blur-sm border text-center",
                                isDark 
                                    ? "bg-red-950/20 border-red-800/20" 
                                    : "bg-white/50 border-red-200/30"
                            )}>
                                <div className={cn(
                                    "text-2xl font-bold",
                                    isDark ? "text-red-400" : "text-red-600"
                                )}>
                                    24/7
                                </div>
                                <div className={cn(
                                    "text-sm",
                                    isDark ? "text-gray-300" : "text-gray-600"
                                )}>
                                    Support
                                </div>
                            </div>
                            <div className={cn(
                                "p-4 rounded-xl backdrop-blur-sm border text-center",
                                isDark 
                                    ? "bg-red-950/20 border-red-800/20" 
                                    : "bg-white/50 border-red-200/30"
                            )}>
                                <div className={cn(
                                    "text-2xl font-bold",
                                    isDark ? "text-red-400" : "text-red-600"
                                )}>
                                    100%
                                </div>
                                <div className={cn(
                                    "text-sm",
                                    isDark ? "text-gray-300" : "text-gray-600"
                                )}>
                                    Secure
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right panel - Login form */}
                <div className="flex items-center justify-center p-6 lg:p-12">
                    <div className={cn(
                        "w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 hover:shadow-3xl",
                        isDark 
                            ? "bg-red-950/30 border-red-800/20 shadow-red-900/40" 
                            : "bg-white/80 border-red-200/30 shadow-red-200/40"
                    )}>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Header */}
                            <div className="text-center space-y-2">
                                <Title className={cn(
                                    "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                                    isDark 
                                        ? "from-red-200 via-white to-gray-200" 
                                        : "from-red-600 via-red-800 to-gray-800"
                                )}>
                                    Admin Access
                                </Title>
                                <p className={cn(
                                    "text-sm",
                                    isDark ? "text-gray-400" : "text-gray-500"
                                )}>
                                    Sign in to your admin dashboard
                                </p>
                                <div className={cn(
                                    "w-16 h-1 mx-auto rounded-full bg-gradient-to-r",
                                    isDark 
                                        ? "from-red-500 to-red-600" 
                                        : "from-red-500 to-red-600"
                                )} />
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className={cn(
                                    "p-4 rounded-lg border-l-4 border-red-500 animate-shake",
                                    isDark 
                                        ? "bg-red-950/40 text-red-300" 
                                        : "bg-red-50 text-red-700"
                                )}>
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Form fields */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <LineTextField 
                                        label="Email Address" 
                                        fullWidth 
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="transition-all duration-200 focus:scale-[1.02]"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <LineTextField 
                                        label="Password" 
                                        fullWidth 
                                        type="password" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="transition-all duration-200 focus:scale-[1.02]"
                                    />
                                </div>
                            </div>

                            {/* Submit button */}
                            <div className="pt-4">
                                <RedButton 
                                    sx={{ 
                                        height: 48,
                                        background: isDark 
                                            ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' 
                                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        boxShadow: isDark 
                                            ? '0 8px 32px rgba(220, 38, 38, 0.4)' 
                                            : '0 8px 32px rgba(239, 68, 68, 0.4)',
                                        transform: 'perspective(1000px)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'perspective(1000px) translateY(-2px)',
                                            boxShadow: isDark 
                                                ? '0 12px 40px rgba(220, 38, 38, 0.5)' 
                                                : '0 12px 40px rgba(239, 68, 68, 0.5)',
                                        }
                                    }} 
                                    type="submit"
                                    className="w-full font-semibold text-lg tracking-wide"
                                >
                                    Access Dashboard
                                </RedButton>
                            </div>

                            {/* Footer */}
                            <div className="text-center pt-6 border-t border-red-200/20">
                                <p className={cn(
                                    "text-xs",
                                    isDark ? "text-gray-500" : "text-gray-400"
                                )}>
                                    • Secure admin authentication •
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Mobile logo overlay */}
            <div className="lg:hidden absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
                <img 
                    className="w-32 h-20 object-contain opacity-10" 
                    src="/kd-logo (1).png" 
                    alt="logo" 
                />
            </div>
        </main>
    )
}

export default AdminLogin