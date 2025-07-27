import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/partials/customer/CustomerHeader";
import CustomerFooter from "../components/partials/customer/CustomerFooter";
import { CustomerContextProvider } from "../context/CustomerContext";
import ChatbotButton from "../components/buttons/Chatbot";

const CustomerLayout = () => {
    return (
        <div className="relative">
            <CustomerContextProvider>
                <CustomerHeader />
                <Outlet />
                <CustomerFooter />
                <ChatbotButton />
            </CustomerContextProvider>
        </div>
    )
}

export default CustomerLayout