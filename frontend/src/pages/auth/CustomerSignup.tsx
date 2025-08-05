import { motion } from "framer-motion"
import { ThemeToggle } from "../../components/Toggle"
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils"
import { GoogleButton, RedButton } from "../../components/buttons/Button"
import { RedTextField } from "../../components/Textfield"

const CustomerSignupPage = () => {
    const isDark = useDarkmode()

    return (
        <div className={cn("h-screen bg-white flex flex-col gap-3 p-5", isDark && "bg-[#1e1e1e]" )}>
            <div className="flex justify-between items-center w-full">
                <img className={cn("w-30 h-15 cursor-pointer", !isDark && 'bg-black')} 
                    onClick={() => window.location.href = '/'} 
                    src="/kd-logo.png" alt="" 
                />
               <ThemeToggle />
            </div>
            <div className="flex-1 w-full lg:grid grid-cols-[1fr_1fr] gap-10">
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
                        <RedTextField placeholder="Email" type="email" required />
                        <div className="w-full flex gap-5">
                        <RedTextField placeholder="Firstname" required />
                        <RedTextField placeholder="Lastname"  required />
                        </div>
                        <RedTextField placeholder="Password" type="password" required/>
                        <RedTextField placeholder="Confirm password" type="password" required/>
                        <RedButton sx={{ paddingY: 1, marginTop: 2 }} fullWidth>Sign Up</RedButton>
                        <div className="w-full flex items-center gap-5 text-gray-400">
                            <hr className="flex-[1]" />
                            <p>OR</p>
                            <hr className="flex-1" />
                        </div>
                        <GoogleButton  theme={isDark ? 'filled_black' : 'filled_blue'} />
                        <div className="w-full flex justify-center mt-4">
                            <p className="text-lg">Already have an account? <a className="text-red-600 hover:underline" href="/login">Login</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerSignupPage