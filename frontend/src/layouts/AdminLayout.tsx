import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/partials/admin/Sidebar"
import { AdminContextProvider } from "../context/AdminContext"
import { AdminNotificationContextProvider } from "../context/AdminNotificationContext"

const AdminLayout = () => {

    return <AdminContextProvider>
            <AdminNotificationContextProvider>
                <main className="h-screen pl-50">
                    <AdminSidebar />
                    <Outlet />
                </main>
            </AdminNotificationContextProvider>
        </AdminContextProvider>
}

export default AdminLayout