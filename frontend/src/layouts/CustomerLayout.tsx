import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/partials/customer/CustomerHeader";
import CustomerFooter from "../components/partials/customer/CustomerFooter";
import { CustomerContextProvider } from "../context/CustomerContext";

const CustomerLayout = () => {
    return (
        <CustomerContextProvider>
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
        </CustomerContextProvider>
    )
}

export default CustomerLayout