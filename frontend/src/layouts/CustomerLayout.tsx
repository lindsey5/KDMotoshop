import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/partials/customer/CustomerHeader";
import CustomerFooter from "../components/partials/customer/CustomerFooter";

const CustomerLayout = () => {
    return (
        <>
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
        </>
    )
}

export default CustomerLayout