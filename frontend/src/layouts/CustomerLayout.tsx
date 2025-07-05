import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/partials/customer/CustomerHeader";
import CustomerFooter from "../components/partials/customer/CustomerFooter";
import { DarkmodeContextProvider } from "../context/DarkmodeContext";

const CustomerLayout = () => {
    return (
        <DarkmodeContextProvider>
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
        </DarkmodeContextProvider>
    )
}

export default CustomerLayout