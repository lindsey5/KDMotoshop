import { Button, FormControlLabel, Modal, Switch } from "@mui/material";
import React, { useState } from "react";
import { RedTextField } from "../Textfield";
import { useBarangays, useCities, useRegions } from "../../hooks/useAddress";
import { CustomizedSelect, StatusSelect } from "../Select";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { RedButton } from "../Button";
import { Statuses } from "../../constants/status";

type OrderInformationModalProps = {
    open: boolean;
    onClose: () => void;
    setOrder: React.Dispatch<React.SetStateAction<Order>>;
    order: Order;
}

const OrderInformationModal : React.FC<OrderInformationModalProps> = ({ open, onClose, setOrder, order }) => {
    const [addAddress, setAddAddress] = useState<boolean>(false);
    const [selectedRegion, setSelectedRegion] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');
    const { regions } = useRegions();
    const { cities } = useCities(selectedRegion);
    const { barangays } = useBarangays(selectedCity);
    
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
            onClose={onClose} 
            className="z-99 p-5 flex justify-center items-start overflow-y-auto"
        >
            <div className="w-[90%] max-w-[600px] items-start p-5 bg-white rounded-md flex flex-col gap-5">
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
                            onChange={handleChange} 
                            checked={addAddress}
                        />
                    }
                    label="Add Address"
                />
                {addAddress && order.address && (
                    <div className="mb-5 w-full bg-gray-100 flex flex-col gap-5 p-3 rounded-md">
                        <CustomizedSelect 
                            label="Region"
                            value={selectedRegion}
                            sx={{ backgroundColor: 'white'}}
                            menu={regions.map((region) => ({ value: region.code, label: region.name }))}
                            onChange={(e) => handleRegionChange(e.target.value as string)}
                        />
                        {selectedRegion && <CustomizedSelect 
                            label="City"
                            value={selectedCity}
                            sx={{ backgroundColor: 'white'}}
                            menu={cities.map((city: any) => ({ value: city.code, label: city.name }))}
                            onChange={(e) => handleCityChange(e.target.value as string)}
                        />}
                        {selectedCity && <CustomizedSelect 
                                label="Barangay"
                                value={order.address.barangay}
                                sx={{ backgroundColor: 'white'}}
                                menu={barangays.map((barangay) => ({ value: barangay, label: barangay }))}
                                onChange={(e) => handleBarangayChange(e.target.value as string)}
                        />}
                        {order.address.barangay && ( 
                            <RedTextField 
                                label="Street, Building, House No." 
                                fullWidth 
                                sx={{ backgroundColor: 'white'}}
                                value={order.address.street || ''}
                                onChange={(e) => setOrder((prev) => ({
                                    ...prev,
                                    address: { ...prev.address!, street: e.target.value}
                                }))}
                            />
                        )}
                    </div>
                )}
                <PhoneInput
                    country={'ph'}
                    onlyCountries={['ph']}
                    specialLabel="Phone (Optional)"
                    value={order.customer.phone || ''}
                    containerStyle={{ width: '100%', height: '55px' }}
                    inputStyle={{ width: '100%', height: '55px' }}
                    onChange={(phone) => setOrder(prev => ({ ...prev, customer: { ...prev.customer, phone } }))}
                />
                <p className="text-gray-500 mb-2">Order Information</p>
                <div className="w-full grid grid-cols-2 gap-6">
                    <CustomizedSelect
                        label="Order Source"
                        value={order.order_source}
                        onChange={(e) => setOrder(prev => ({ ...prev, order_source: e.target.value as Order['order_source'] }))}
                        menu={['Store', 'Facebook', 'Shopee', 'Lazada'].map(method => ({ value: method, label: method }))}
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
                        menu={['Cash', 'GCash', 'Other'].map(method => ({ value: method, label: method }))}
                    />
                </div>
                <RedTextField 
                    label="Note (Optional)" 
                    fullWidth 
                    multiline 
                    rows={4} 
                    value={order.note || ''}
                    onChange={(e) => setOrder(prev => ({ ...prev, note: e.target.value }))}
                />
                <div className="w-full flex justify-end gap-5 mt-5">
                    <Button 
                        variant="outlined" 
                        sx={{ border: 1, borderColor: 'gray', color: 'gray'}}
                        onClick={onClose}
                    >Close</Button>
                    <RedButton onClick={onClose}>Save</RedButton>
                </div>
            </div>
        </Modal>
    )
}

export default OrderInformationModal
