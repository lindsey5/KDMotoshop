import { useEffect, useState } from "react";
import { Plus, MapPin, Trash2, Phone, User } from "lucide-react";
import AddAddress from "./AddAddress";
import { updateData } from "../../../../services/api";
import type { RootState } from "../../../../features/store";
import { useSelector } from "react-redux";
import { confirmDialog, successAlert } from "../../../../utils/swal";
import Card from "../../../../components/Card";
import { RedButton } from "../../../../components/buttons/Button";

type AddressesProps = {
  isDark: boolean;
  defaultAddresses: Address[];
};

const Addresses = ({ isDark, defaultAddresses }: AddressesProps) => {
    const { user : customer } = useSelector((state : RootState) => state.user)
    const [addresses, setAddresses] = useState<Address[]>(defaultAddresses);
    const [isAdding, setIsAdding] = useState(false);

    const handleDelete = async (index: number) => {
        if (await confirmDialog("Delete Address", "Are you sure you want to delete this address?", isDark)) {
            setAddresses(addresses.filter((_, i) => i !== index));
            await successAlert("Deleted!", "The address has been removed successfully.", isDark);
        }
    };

    const handleSetDefault = (index: number) => {
        setAddresses(
        addresses.map((addr, i) => ({
            ...addr,
            isDefault: i === index,
        }))
        );
    };

    useEffect(() => {
        const updateAddresses = async () => {
            await updateData('/api/customers', {...customer, addresses })
        }

        updateAddresses();

    }, [addresses])

    return (
        <div className='min-h-screen transition-colors duration-300'>
        <div className="max-w-4xl mx-auto px-6 py-12">
            {/* Refined Header */}
            <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                <h1 className={`text-3xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                }`}>
                    My Addresses
                </h1>
                <p className={`${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                    Manage your delivery locations
                </p>
                </div>
                <RedButton 
                    onClick={() => setIsAdding(true)}
                    sx={{ textTransform: "none" }} 
                    startIcon={<Plus size={20} />}
                >Add Address</RedButton>
            </div>
            <div className={`h-px w-full ${
                isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`}></div>
            </div>

            {/* Sophisticated Add Form */}
            {isAdding && (
                <AddAddress 
                    close={() => setIsAdding(false)} 
                    isDark={isDark} setAddresses={setAddresses}
                />
            )}

            {/* Refined Address Cards */}
            <div className="space-y-6">
            {addresses.map((address, index) => (
                <Card key={index} className='p-6 rounded-2xl border shadow-sm'>
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${
                            isDark ? 'bg-red-600/20' : 'bg-red-100'
                            }`}>
                            <User className={`${
                                isDark ? 'text-red-400' : 'text-red-600'
                            }`} size={20} />
                            </div>
                            <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-lg font-semibold ${
                                isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                {address.firstname} {address.lastname}
                                </h3>
                                {address.isDefault && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    isDark 
                                    ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                    Default
                                </span>
                                )}
                            </div>
                            {address.phone && (
                                <div className="flex items-center gap-2">
                                <Phone size={14} className={`${
                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span className={`text-sm ${
                                    isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {address.phone}
                                </span>
                                </div>
                            )}
                            </div>
                        </div>
                        
                        <div className={`ml-16 p-4 rounded-lg ${
                            isDark ? 'bg-[#313131]' : 'bg-gray-100'
                        }`}>
                            <div className="flex items-start gap-2">
                            <MapPin size={16} className={`mt-1 ${
                                isDark ? 'text-red-400' : 'text-red-600'
                            }`} />
                            <div className={`text-sm leading-relaxed ${
                                isDark ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                <div className="font-medium mb-1">{address.street}</div>
                                <div>{address.barangay}, {address.city}</div>
                                <div className={`${
                                isDark ? 'text-red-400' : 'text-red-600'
                                }`}>
                                {address.region}
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div className="flex lg:flex-col items-end gap-3">
                        <button
                            onClick={() => handleDelete(index)}
                            className={`p-3 rounded-lg transition-all duration-200 ${
                            isDark 
                                ? 'text-gray-400 hover:bg-red-600/20 hover:text-red-400' 
                                : 'text-gray-500 hover:bg-red-50 hover:text-red-600'
                            } hover:scale-105`}
                        >
                            <Trash2 size={18} />
                        </button>
                        
                        {!address.isDefault && (
                            <button
                            onClick={() => handleSetDefault(index)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                                isDark 
                                ? 'border-gray-600 text-gray-300 hover:bg-red-600/20 hover:border-red-600 hover:text-red-400' 
                                : 'border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600'
                            }`}
                            >
                            Set Default
                            </button>
                        )}
                        </div>
                    </div>
                </Card>
            ))}
            </div>

            {/* Refined Empty State */}
            {addresses.length === 0 && (
            <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
                isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-300 bg-gray-50/30'
            }`}>
                <div className={`mx-auto mb-6 p-4 rounded-full w-fit ${
                isDark ? 'bg-red-600/20' : 'bg-red-100'
                }`}>
                <MapPin size={32} className={`${
                    isDark ? 'text-red-400' : 'text-red-600'
                }`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
                }`}>
                No addresses yet
                </h3>
                <p className={`${
                isDark ? 'text-gray-400' : 'text-gray-600'
                } mb-6 max-w-md mx-auto`}>
                Add your first delivery address to get started with your orders
                </p>
                <button
                onClick={() => setIsAdding(true)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isDark 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } shadow-sm hover:shadow-lg transform hover:-translate-y-0.5`}
                >
                <Plus size={20} />
                Add Your First Address
                </button>
            </div>
            )}
        </div>
        </div>
    );
};

export default Addresses;