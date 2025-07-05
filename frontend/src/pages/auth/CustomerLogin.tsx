import { GoogleButton, RedButton } from "../../components/Button";
import { cn } from "../../utils/utils";

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
    return (
        <div className="bg-[#363636] h-screen flex lg:grid lg:grid-cols-[2fr_1.5fr] gap-20 p-10 items-center">
            <div className="h-full rounded-2xl bg-gradient-to-br from-black via-red-900 to-gray-900 hidden lg:block"
                style={{ clipPath: 'polygon(17% 11%, 17% 0, 100% 0, 100% 89%, 83% 89%, 83% 100%, 0 100%, 0 11%) '}}
            >
                <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
                    <h1 className="text-white text-5xl 2xl:text-6xl font-bold">Welcome to</h1>
                    <img className="w-[60%] 2xl:h-[300px] h-[250px]" src="/kd-logo (1).png" alt="logo" />
                    <h1 className="text-white text-4xl 2xl:text-5xl">Ride better. Shop better</h1>
                </div>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <div className="w-full text-white flex flex-col gap-5 max-w-[500px]">
                    <h1 className="font-bold text-4xl mb-10">Welcome Back...</h1>
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
                    <a className="hover:underline" href="">Forgot Password</a>
                    <RedButton sx={{ borderRadius: 50, marginTop: 2 }}>Login</RedButton>
                    <div className="w-full flex items-center gap-10">
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