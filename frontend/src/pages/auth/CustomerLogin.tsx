import { GoogleButton, RedButton } from "../../components/Button";
import { cn } from "../../utils/utils";
import { ThemeToggle } from "../../components/Toggle";
import { RedTextField } from "../../components/Textfield";
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
        <div className={cn("bg-white h-screen flex lg:grid lg:grid-cols-[2fr_1.5fr] gap-20 p-5 items-center", isDark && "bg-[#1e1e1e]" )}>
            <div className="absolute z-10 top-5 right-5">
                <ThemeToggle />
            </div>
            <img 
                className="h-full rounded-3xl"
                src="/evo-helmet.png" 
                alt="" 
            />
            <div className="flex-1 flex justify-center items-center">
                <div className={cn("w-full flex flex-col items-start gap-5 max-w-[500px]", isDark && 'text-white')}>
                    <h1 className="font-bold text-4xl">Login</h1>
                    <p className={cn(isDark ? 'text-gray-200' : 'text-gray-400')}>Welcome back! Please login to continue.</p>
                    <GoogleButton  theme={isDark ? 'filled_black' : 'filled_blue'} />
                    <div className="w-full flex items-center gap-5 text-gray-400">
                        <hr className="flex-[0.1]" />
                        <p>OR</p>
                        <hr className="flex-1" />
                    </div>
                    <RedTextField placeholder="Email" />
                    <RedTextField placeholder="Password" type="password"/>
                    <a className={cn("hover:underline text-gray-600", isDark && 'text-gray-200')} href="">Forgot Password</a>
                    <RedButton sx={{ paddingY: 1, marginTop: 2 }} fullWidth>Login</RedButton>
                    <div className="w-full flex justify-center mt-4">
                        <a className={cn("text-gray-600 hover:underline", isDark && 'text-gray-200')} href="">Create an account</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerLogin