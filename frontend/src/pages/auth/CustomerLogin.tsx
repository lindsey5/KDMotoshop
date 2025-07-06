import { GoogleButton, RedButton } from "../../components/Button";
import { cn } from "../../utils/utils";
import { ThemeToggle } from "../../components/Toggle";
import { RedTextField } from "../../components/Textfield";
import * as motion from "motion/react-client"
import useDarkmode from "../../hooks/useDarkmode";

interface LoginTextFieldProps{
    placeholder: string;
    value: string;
    type: 'text' | 'password' | 'number'
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const LoginTextField : React.FC<LoginTextFieldProps> = ({ ...props }) => {
    return (
        <input 
            className={cn("bg-[#575757] px-5 py-3 w-full rounded-full outline-none")}
            {...props}
        />
    )
}

const CustomerLogin = () => {
    const isDark = useDarkmode();

    return (
        <div className={cn("bg-white h-screen flex lg:grid lg:grid-cols-[2fr_1.5fr] gap-20 p-10 items-center", isDark && "bg-[#1e1e1e]" )}>
            <div className="absolute z-10 top-5 right-5">
                <ThemeToggle />
            </div>
            <motion.div 
                className="h-full rounded-2xl bg-gradient-to-br from-black via-red-900 to-gray-900 hidden lg:block"
                style={{ clipPath: 'polygon(17% 11%, 17% 0, 100% 0, 100% 89%, 83% 89%, 83% 100%, 0 100%, 0 11%) '}}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0}}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
                    <h1 className="text-white text-5xl 2xl:text-6xl font-bold">Welcome to</h1>
                    <img className="w-[60%] 2xl:h-[300px] h-[250px]" src="/kd-logo (1).png" alt="logo" />
                    <h1 className="text-white text-4xl 2xl:text-5xl">Ride better. Shop better</h1>
                </div>
            </motion.div>
            <div className="flex-1 flex justify-center items-center">
                <div className={cn("w-full flex flex-col gap-5 max-w-[500px]", isDark && 'text-white')}>
                    <h1 className="font-bold text-4xl mb-10">Welcome Back...</h1>
                    {isDark ? 
                        <>
                        <LoginTextField 
                            placeholder="Email"
                            value=""
                            type="text"
                            onChange={() => console.log('')}
                        />
                        <LoginTextField 
                            placeholder="Password"
                            value=""
                            type="password"
                            onChange={() => console.log('')}
                        />
                        </>

                        : <>
                            <RedTextField placeholder="Email" />
                            <RedTextField placeholder="Password" type="password"/>
                        </>
                        
                    }
                    <a className="hover:underline" href="">Forgot Password</a>
                    <RedButton sx={{ borderRadius: 50, marginTop: 2 }}>Login</RedButton>
                    <div className="w-full flex items-center gap-10 text-gray-400">
                    <hr className="flex-1" />
                    <p>OR</p>
                    <hr className="flex-1" />
                    </div>
                    <GoogleButton />
                </div>
            </div>
        </div>
    )
}

export default CustomerLogin