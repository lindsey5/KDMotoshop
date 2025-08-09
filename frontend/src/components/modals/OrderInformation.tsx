import { Button, FormControlLabel, Modal, Switch } from "@mui/material";
import React, { memo, useState } from "react";
import { RedTextField } from "../Textfield";
import { useAddress } from "../../hooks/useAddress";
import { CustomizedSelect, StatusSelect } from "../Select";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { RedButton } from "../buttons/Button";
import Card from "../cards/Card";
import useDarkmode from "../../hooks/useDarkmode";
import { cn } from "../../utils/utils";

const Statuses = [
    { value: 'Pending', label: 'Pending', color: 'orange' },
    { value: 'Delivered', label: 'Delivered', color: 'purple' },
]

interface OrderInformationModalProps extends ModalProps {
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
    order: Order;
}

const OrderInformationModal = ({ open, close, setOrder, order } : OrderInformationModalProps) => {
    const [addAddress, setAddAddress] = useState<boolean>(false);
    const { selectedCity, setSelectedCity, selectedRegion, setSelectedRegion, regions, cities, barangays } = useAddress();
    const isDark = useDarkmode();
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddAddress(event.target.checked);
        if(event.target.checked) {
            setOrder(prev => ({
                ...prev,
                address: {
                    street: '',
                    barangay: '',
                    city: '',
                    region: '',
                }
            }));
        }else{
            setSelectedCity('');
            setSelectedRegion('');
            setOrder(prev => {
                const { address, ...rest } = prev;
                return rest;
            })
        }
    };

    const handleRegionChange = (value : string) => {
        const selectedCode = value;
        const selectedRegion = regions.find((city: any) => city.code === selectedCode);
        setSelectedRegion(selectedCode);

        if (selectedRegion) setOrder((prev) => ({...prev, address: { ...prev.address!, region: selectedRegion.name,}}));
    };

    const handleCityChange = (value : string) => {
        const selectedCode = value;
        const selectedCity = cities.find((city: any) => city.code === selectedCode);
        setSelectedCity(selectedCode);

        if (selectedCity) setOrder((prev) => ({...prev, address: { ...prev.address!, city: selectedCity.name,}}));
    };

    const handleBarangayChange = (value: string) => {
        setOrder((prev) => ({
            ...prev,
            address: { ...prev.address!, barangay: value }
        }));
    };

    return(
        <Modal 
            open={open}
            onClose={close} 
            className="z-99 p-5 flex justify-center items-start overflow-y-auto"
        >
            <Card className="w-[90%] max-w-[600px] items-start p-5 rounded-md flex flex-col gap-5">
                <h1 className="font-bold text-2xl mb-4">Customer & Order Info</h1>
                <p className="text-gray-500">Customer</p>
                <div className="w-full flex gap-5">
                    <RedTextField 
                        label="Firstname" 
                        fullWidth
                        value={order.customer.firstname || ''}
                        onChange={(e) => setOrder(prev => ({ ...prev, customer: { ...prev.customer, firstname: e.target.value } }))}
                    />
                    <RedTextField 
                        label="Lastname" 
                        fullWidth
                        value={order.customer.lastname || ''}
                        onChange={(e) => setOrder(prev => ({ ...prev, customer: { ...prev.customer, lastname: e.target.value } }))}
                    />
                </div>
                <FormControlLabel
                control={
                    <Switch
                    checked={addAddress}
                    onChange={handleChange}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'red',
                        '&:hover': {
                        backgroundColor: 'rgba(255, 0, 0, 0.08)', // optional hover effect
                    },
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'red',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-thumb': {
                        backgroundColor: isDark ? 'red' : '',
                        },
                        '& .MuiSwitch-track': {
                        backgroundColor: isDark ? ' #e5e7eb' : ' #374151' , // track base color
                        },
                    }}
                    />
                }
                label="Add Address"
                />
                {addAddress && order.address && (
                    <div className={cn("mb-5 w-full flex flex-col gap-5 p-3 rounded-md", isDark ? 'bg-[#3d3d3d]' : 'bg-gray-100' )}>
                        <CustomizedSelect 
                            label="Region"
                            value={selectedRegion}
                            menu={regions.map((region : any) => ({ value: region.code, label: region.name }))}
                            onChange={(e) => handleRegionChange(e.target.value as string)}
                        />
                        {selectedRegion && <CustomizedSelect 
                            label="City"
                            value={selectedCity}
                            menu={cities.map((city: any) => ({ value: city.code, label: city.name }))}
                            onChange={(e) => handleCityChange(e.target.value as string)}
                        />}
                        {selectedCity && <CustomizedSelect 
                                label="Barangay"
                                value={order.address.barangay}
                                menu={barangays.map((barangay : any) => ({ value: barangay, label: barangay }))}
                                onChange={(e) => handleBarangayChange(e.target.value as string)}
                        />}
                        {order.address.barangay && ( 
                            <RedTextField 
                                label="Street, Building, House No." 
                                fullWidth 
                                value={order.address.street || ''}
                                onChange={(e) => setOrder((prev) => ({
                                    ...prev,
                                    address: { ...prev.address!, street: e.target.value}
                                }))}
                            />
                        )}
                    </div>
                )}
                <label
                    className={`block text-sm font-medium ${
                    isDark ? 'text-white' : 'text-gray-800'
                    }`}
                >
                    Phone (Optional)
                </label>

                <PhoneInput
                    country={'ph'}
                    onlyCountries={['ph']}
                    specialLabel="" 
                    value={order.customer.phone || ''}
                    containerStyle={{ width: '100%', height: '55px' }}
                    inputStyle={{
                        width: '100%',
                        height: '55px',
                        backgroundColor: isDark ? '#313131' : '#fff',
                        color: isDark ? 'white' : 'black',
                    }}
                    onChange={(phone) =>
                        setOrder((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, phone },
                        }))
                    }
                />
                <p className="text-gray-500 mb-2">Order Information</p>
                <div className="w-full grid grid-cols-2 gap-6">
                    <CustomizedSelect
                        label="Order Source"
                        value={order.order_source}
                        onChange={(e) => setOrder(prev => ({ ...prev, order_source: e.target.value as Order['order_source'] }))}
                        menu={['Store', 'Facebook', 'Shopee', 'Lazada', 'Tiktok'].map(method => ({ value: method, label: method }))}
                    />
                    <StatusSelect 
                        value={order.status}
                        onChange={(e) => setOrder(prev => ({ ...prev, status: e.target.value as Order['status'] }))}
                        menu={Statuses}
                    />
                    <CustomizedSelect 
                        label="Payment Method"
                        value={order.payment_method}
                        onChange={(e) => setOrder(prev => ({ ...prev, payment_method: e.target.value as Order['payment_method'] }))}
                        menu={['CASH', 'GCASH', 'PAYMAYA', "CARD"].map(method => ({ value: method, label: method }))}
                    />
                </div>
                <div className="w-full flex justify-end gap-5 mt-5">
                    <Button 
                        variant="outlined" 
                        sx={{ border: 1, borderColor: 'gray', color: isDark ? 'white' : ''}}
                        onClick={close}
                    >Close</Button>
                    <RedButton onClick={close}>Save</RedButton>
                </div>
            </Card>
        </Modal>
    )
}

export default memo(OrderInformationModal)
