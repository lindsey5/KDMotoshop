import { Outlet } from "react-router-dom"
import CustomerHeader from "../pages/customer/ui/CustomerHeader";
import CustomerFooter from "../pages/customer/ui/CustomerFooter";
import ChatbotButton from "../components/buttons/Chatbot";

const CustomerLayout = () => {

    return (
        <div className="relative">
            <CustomerHeader />
            <Outlet />
            <CustomerFooter />
            <ChatbotButton />
        </div>
    )
}

export default CustomerLayout