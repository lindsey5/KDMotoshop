import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../components/partials/admin/Sidebar"
import { UserContextProvider } from "../context/UserContext"

const AdminLayout = () => {

    return <UserContextProvider>
            <main className="h-screen pl-50">
                <AdminSidebar />
                <Outlet />
            </main>
        </UserContextProvider>
}

export default AdminLayout