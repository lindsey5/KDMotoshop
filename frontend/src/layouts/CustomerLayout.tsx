import { Outlet } from "react-router-dom"
import CustomerHeader from "../components/partials/customer/CustomerHeader";
import CustomerFooter from "../components/partials/customer/CustomerFooter";
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