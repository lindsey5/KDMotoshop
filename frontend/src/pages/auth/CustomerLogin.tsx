import { GoogleButton, RedButton } from "../../components/buttons/Button";
import { cn } from "../../utils/utils";
import { ThemeToggle } from "../../components/Toggle";
import { RedTextField } from "../../components/Textfield";
import useDarkmode from "../../hooks/useDarkmode";
import * as motion from "motion/react-client"
import { useState } from "react";
import { postData } from "../../services/api";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const CustomerLogin = () => {
    const isDark = useDarkmode();
    const [error, setError] = useState('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { user, loading } = useSelector((state : RootState) => state.user)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('')
        const response = await postData('/api/auth/login', { email, password });
        if(response.success){
            window.location.href = '/'
        }else{
            setError(response.message || response)
        }
    };
    
    if(user && !loading){
        return <Navigate to="/" />
    }

    return (
        <div className={cn("h-screen bg-white flex lg:grid grid-cols-[1fr_1fr] gap-10 p-5", isDark && "bg-[#1e1e1e]" )}>
            <img className={cn("z-1 absolute top-5 left-5 w-30 h-15 cursor-pointer", !isDark && 'bg-black')} 
                onClick={() => window.location.href = '/'} 
                src="/kd-logo.png" alt="" 
            />
            <div className="absolute z-10 top-5 right-5">
                <ThemeToggle />
            </div>

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
        
            <form className="flex-1 flex justify-center items-center" onSubmit={handleSubmit}>
                <div className={cn("w-full flex flex-col items-start gap-5 lg:w-[500px] 2xl:w-[600px]", isDark && 'text-white')}>
                    <h1 className="font-bold text-4xl">Login</h1>
                    <p className={cn(isDark ? 'text-gray-200' : 'text-gray-400')}>Welcome! Please login to continue.</p>
                    <GoogleButton  theme={isDark ? 'filled_black' : 'filled_blue'} />
                    <div className="w-full flex items-center gap-5 text-gray-400">
                        <hr className="flex-[1]" />
                        <p>OR</p>
                        <hr className="flex-1" />
                    </div>
                    {error && <p className="text-red-600">{error}</p>}
                    <RedTextField required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <RedTextField required placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <a className={cn("hover:underline text-gray-600", isDark && 'text-gray-200')} href="">Forgot Password</a>
                    <RedButton type="submit" sx={{ paddingY: 1, marginTop: 2 }} fullWidth>Login</RedButton>
                    <div className="w-full flex justify-center mt-4">
                        <p className={cn("text-lg", isDark && 'text-gray-400')}>Don't have an account? <a className={cn("text-red-600 hover:underline", isDark && 'text-white font-bold')} href="/signup">Create an account</a></p>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default CustomerLogin