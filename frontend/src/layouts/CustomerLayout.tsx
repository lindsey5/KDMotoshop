import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/customer/CustomerHeader";
import CustomerFooter from "../components/customer/CustomerFooter";

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