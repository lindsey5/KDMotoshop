import { useState } from "react";
import { User, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../features/store";
import UserAvatar from "../../ui/UserAvatar";
import useDarkmode from "../../../hooks/useDarkmode";
import ProfileSettings from "./ui/ProfileSetting";
import Addresses from "./ui/Addresses";

const CustomerProfile = () => {
    const isDark = useDarkmode();
    const [activeTab, setActiveTab] = useState("Profile");
    const { user : customer } = useSelector((state : RootState) => state.user)
    const tabs = [
        { id: "Profile", label: "Profile", icon: User },
        { id: "Addresses", label: "Addresses", icon: MapPin },
    ];

    if(!customer) return null

    return (
        <div className={`mt-20 min-h-screen ${isDark ? 'bg-[#1e1e1e]' : 'bg-neutral-50'}`}>
        {/* Header with Profile Info */}
        <div className={`${isDark ? 'bg-[#121212] border-gray-700' : 'bg-white border-neutral-200'} border-b`}>
            <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                <div className="relative">
                    <UserAvatar sx={{ width: 60, height: 60 }} image={customer?.image}/>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {customer?.firstname} {customer?.lastname}
                    </h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                    {customer?.email}
                    </p>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className={`${isDark ? 'bg-[#121212] border-gray-700' : 'bg-white border-neutral-200'} border-b`}>
            <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-8">
                {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                        isActive
                        ? `border-red-500 ${isDark ? 'text-red-400' : 'text-red-600'}`
                        : `border-transparent ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                    }`}
                    >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                    </button>
                );
                })}
            </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-8">
            {activeTab === "Profile" && (
                <ProfileSettings customer={customer as Customer} isDark={isDark}/>
            )}

            {activeTab === "Addresses" && (
                <Addresses isDark={isDark} defaultAddresses={customer?.role === 'Customer' ? customer.addresses ?? [] : []}/>
            )}
        </div>
        </div>
    );
};

export default CustomerProfile;