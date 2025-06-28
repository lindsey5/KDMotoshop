import { Outlet } from "react-router-dom"
import { lazy } from "react";
import { ObserverContextProvider } from "../context/ObserverContext";
const CustomerHeader = lazy(() => import('../components/customer/CustomerHeader'));

const CustomerLayout = () => {
    return (
        <ObserverContextProvider>
            <CustomerHeader />
            <Outlet />
        </ObserverContextProvider>
    )
}

export default CustomerLayout