import { Navigate, Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/partials/admin/Sidebar"
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { CircularProgress } from "@mui/material";
import useDarkmode from "../hooks/useDarkmode";
import { cn } from "../utils/utils";
import LowStockNotification from "../components/LowStockNotification";

const AdminLayout = () => {
    const isDark = useDarkmode();
    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)

    if(!user && userLoading){
        return (
            <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
                <CircularProgress sx={{ color: 'red'}}/>
            </div>
        )
    }

    if (!user && !userLoading) {
        return <Navigate to="/admin/login" />;
    }

    if(user && user.role === 'Customer' && !userLoading) {
        return <Navigate to="/" />;
    }


    return <main className="h-screen md:pl-50">
            <LowStockNotification />
            <AdminSidebar />
            <Outlet />
        </main>
}

export default AdminLayout