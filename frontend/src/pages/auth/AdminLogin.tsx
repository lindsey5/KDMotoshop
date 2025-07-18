import { useEffect, useState } from "react"
import { LineTextField } from "../../components/Textfield"
import { RedButton } from "../../components/Button";
import { fetchData, postData } from "../../services/api";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('')
        const response = await postData('/api/auth/admin/login', { email, password });
        if(response.success){
            localStorage.setItem('token', response.token)
            window.location.href = '/admin/dashboard'

        }else{
            setError(response.message)
        }
    };

      useEffect(() => {
        const getUser = async () => {
          const response = await fetchData('/api/admin');
    
          if (response.success) navigate("/admin/dashboard", { replace: true });
        };
    
        getUser();
      }, []);

    return (
        <main className="h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:flex h-full flex flex-col items-center justify-center gap-6 shadow-red-600/25 bg-gradient-to-br from-black via-red-900 to-gray-900">
                <h1 className="text-white text-5xl font-bold">Welcome to</h1>
                <img className="w-[50%] h-[230px]" src="/kd-logo (1).png" alt="logo" />
                <h1 className="text-white text-3xl">Ride better. Shop better</h1>
            </div>        
            <form className="h-full flex justify-center items-center" onSubmit={handleSubmit}>
                <div className="p-5 w-[70%] flex flex-col gap-10">
                    <h1 className="font-bold text-4xl">Hello, Admin</h1>
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
    )
}

export default AdminLogin