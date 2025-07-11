import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/partials/customer/CustomerHeader";
import CustomerFooter from "../components/partials/customer/CustomerFooter";
import { CustomerContextProvider } from "../context/CustomerContext";
import { CartContextProvider } from "../context/CartContext";

const CustomerLayout = () => {
    return (
        <CustomerContextProvider>
            <CartContextProvider>
                <CustomerHeader />
                <Outlet />
                <CustomerFooter />
            </CartContextProvider>
        </CustomerContextProvider>
    )
}

export default CustomerLayout