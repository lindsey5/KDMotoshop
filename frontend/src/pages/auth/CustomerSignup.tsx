import { motion } from "framer-motion"
import { ThemeToggle } from "../../components/Toggle"
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils"
import { GoogleButton, RedButton } from "../../components/buttons/Button"
import { PasswordField, RedTextField } from "../../components/Textfield"
import { useState } from "react"
import VerifyEmailModal from "../ui/VerifyEmail"
import { postData } from "../../services/api"
import { useSelector } from "react-redux"
import type { RootState } from "../../features/store"
import { Navigate } from "react-router-dom"

const CustomerSignupPage = () => {
    const isDark = useDarkmode()
    const [newCustomer, setNewCustomer] = useState<NewCustomer>();
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)

    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)
        setError('');
        if (newCustomer?.password !== newCustomer?.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        const response = await postData('/api/auth/signup/verification', { email: newCustomer?.email, password: newCustomer?.password})
        
        response.success ? setShowVerificationModal(true) : setError(response.message)
        setLoading(false)
    }

    if(user && !userLoading){
        return <Navigate to="/" />
    }

    return (
        <div className={cn("min-h-screen bg-white flex flex-col gap-3 p-5", isDark && "bg-[#1e1e1e]" )}>
            <VerifyEmailModal 
                open={showVerificationModal} 
                customer={newCustomer as NewCustomer} 
                close={() => setShowVerificationModal(false)}
            />
            <div className="flex justify-between items-center w-full">
                <img className={cn("hidden sm:block w-30 h-15 cursor-pointer", !isDark && 'bg-black')} 
                    onClick={() => window.location.href = '/'} 
                    src="/kd-logo.png" alt="" 
                />
               <ThemeToggle />
            </div>
            <form className="flex-1 w-full lg:grid grid-cols-[1fr_1fr] gap-10" onSubmit={handleSubmit}>
                <div className="p-5 relative hidden lg:block">
                    <motion.img 
                        className="z-1 absolute w-1/2 h-[45%] left-10 top-20 rounded-xl" src="/helmet.png" alt="helmet"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.6, type: "spring", stiffness: 100, }}
                    />
                    <motion.img 
                        className="absolute w-1/2 h-[45%] bottom-20 right-5 rounded-xl" src="/evo.webp" alt="helmet" 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 0.6, type: "spring", stiffness: 100, }}
                    />
                </div>
                <div className="flex-grow flex justify-center items-center">
                    <div className={cn("w-full flex flex-col items-start gap-5 lg:w-[500px] 2xl:w-[600px]", isDark && 'text-white')}>
                        <h1 className="font-bold text-4xl">Sign Up</h1>
                        <p className={cn(isDark ? 'text-gray-200' : 'text-gray-400')}>Create your account to get started</p>
                        <p className="text-red-500">{error}</p>
                        <RedTextField 
                            placeholder="Email" 
                            type="email" 
                            required 
                            onChange={(e) => setNewCustomer(prev => ({...prev!, email: e.target.value}))}
                            inputProps={{ maxLength: 100 }}
                        />
                        <div className="w-full flex gap-5">
                        <RedTextField 
                            placeholder="Firstname" 
                            required 
                            onChange={(e) => setNewCustomer(prev => ({...prev!, firstname: e.target.value}))}
                            inputProps={{ maxLength: 50 }}
                        />
                        <RedTextField 
                            placeholder="Lastname"  
                            required 
                            onChange={(e) => setNewCustomer(prev => ({...prev!, lastname: e.target.value}))}
                            inputProps={{ maxLength: 50 }}
                        />
                        </div>
                        <PasswordField 
                            placeholder="Password" 
                            required
                            onChange={(e) => setNewCustomer(prev => ({...prev!, password: e.target.value}))}
                            inputProps={{ maxLength: 64 }}
                        />
                        <PasswordField 
                            placeholder="Confirm password" 
                            required
                            onChange={(e) => setNewCustomer(prev => ({...prev!, confirmPassword: e.target.value}))}
                            inputProps={{ maxLength: 64 }}
                        />
                        <RedButton disabled={loading} type="submit" sx={{ paddingY: 1, marginTop: 2 }} fullWidth>Sign Up</RedButton>
                        <div className="w-full flex items-center gap-5 text-gray-400">
                            <hr className="flex-[1]" />
                            <p>OR</p>
                            <hr className="flex-1" />
                        </div>
                        <GoogleButton  theme={isDark ? 'filled_black' : 'filled_blue'} />
                        <div className="w-full flex justify-center mt-4">
                            <p className={cn("text-lg", isDark && 'text-gray-400')}>Already have an account? <a className={cn("text-red-600 hover:underline font-semibold", isDark && 'text-white')} href="/login">Login</a></p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CustomerSignupPage