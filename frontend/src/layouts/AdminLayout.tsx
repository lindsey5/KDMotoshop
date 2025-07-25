import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/partials/admin/Sidebar"
import { AdminContextProvider } from "../context/AdminContext"
const AdminLayout = () => {

    return <AdminContextProvider>
                <main className="h-screen pl-50">
                    <AdminSidebar />
                    <Outlet />
                </main>
        </AdminContextProvider>
}

export default AdminLayout