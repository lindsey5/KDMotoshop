import { ThemeToggle } from "../../components/Toggle"
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils"

const CustomerSignupPage = () => {
    const isDark = useDarkmode()

    return (
        <div className={cn("h-screen bg-white flex lg:grid grid-cols-[1fr_1fr] gap-10 p-5", isDark && "bg-[#1e1e1e]" )}>
            <img className={cn("z-1 absolute top-5 left-5 w-30 h-15 cursor-pointer", !isDark && 'bg-black')} 
                onClick={() => window.location.href = '/'} 
                src="/kd-logo.png" alt="" 
            />
            <div className="absolute z-10 top-5 right-5">
                <ThemeToggle />
            </div>

        </div>
    )
}

export default CustomerSignupPage