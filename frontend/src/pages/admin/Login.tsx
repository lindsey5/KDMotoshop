import { useEffect, useState } from "react"
import { LineTextField } from "../../components/Textfield"
import { RedButton } from "../../components/Button";
import { fetchData, postData } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [selectedRole, setSelectedRole] = useState<string>('Admin');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('')
        const response = await postData('/api/auth/login', { email, password, role: selectedRole});
        if(response.success){
            localStorage.setItem('token', response.token)
            const path = response.user.role === 'Admin' ? '/admin/dashboard' : '/staff'
            window.location.href = path

        }else{
            setError(response.message)
        }
    };

      useEffect(() => {
        const getUser = async () => {
          const response = await fetchData('/api/user');
    
          if (response.success) navigate("/admin/dashboard", { replace: true });
        };
    
        getUser();
      }, []);

    return <main className="h-screen grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex h-full flex flex-col items-center justify-center gap-6 shadow-red-600/25 bg-gradient-to-br from-black via-red-900 to-gray-900">
            <h1 className="text-white text-5xl font-bold">Welcome to</h1>
            <img className="w-[50%] h-[230px]" src="/kd-logo (1).png" alt="logo" />
            <h1 className="text-white text-3xl">Ride better. Shop better</h1>
        </div>        
        <form className="h-full flex justify-center items-center" onSubmit={handleSubmit}>
            <div className="p-5 w-[70%] flex flex-col gap-10">
                <h1 className="font-bold text-4xl">Hello, <span className="text-red-500">{selectedRole}</span></h1>
                <div className="w-full grid grid-cols-2 gap-10 px-7">
                    <button 
                        type="button"
                        className={`cursor-pointer hover:bg-gray-100 h-[35px] text-xl 
                            ${selectedRole === 'Admin' ? 'text-red-600 border-b-2 border-red-500' : ''}`}
                        onClick={() => setSelectedRole('Admin')}
                    >Admin</button>
                    <button 
                        type="button"
                        className={`cursor-pointer hover:bg-gray-100 h-[35px] text-xl 
                            ${selectedRole === 'Staff' ? 'text-red-600 border-b-2 border-red-500' : ''}`}
                        onClick={() => setSelectedRole('Staff')}
                    >Staff</button>
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <LineTextField 
                    label="Email" 
                    fullWidth 
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <LineTextField 
                    label="Password" 
                    fullWidth 
                    type="password" 
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <RedButton sx={{ height: 40}} type="submit">Login</RedButton>
                
            </div>
        </form>

    </main>
}

export default Login