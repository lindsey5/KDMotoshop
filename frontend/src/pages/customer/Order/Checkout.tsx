import { useContext, useEffect, useMemo, useState } from "react";
import {  href, useLocation, useNavigate } from "react-router-dom";
import { fetchData } from "../../../services/api";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn, formatNumber } from "../../../utils/utils";
import Card from "../../../components/Card";
import { CustomerContext } from "../../../context/CustomerContext";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AddIcon from '@mui/icons-material/Add';
import { useAddress } from "../../../hooks/useAddress";
import { CustomizedSelect } from "../../../components/Select";
import { RedTextField } from "../../../components/Textfield";
import { RedButton } from "../../../components/Button";
import { Button } from "@mui/material";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { CustomizedChip } from "../../../components/Chip";
import PhoneInput from "react-phone-input-2";
import { calculateShippingFee } from "../../../utils/shipping";

type Address = {
    street: string;
    barangay: string;
    city: string;
    region: string;
    firstname: string;
    lastname: string;
    phone: string;
}

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Checkout', href: '/checkout' }
]

const CheckoutPage = () => {
    const savedItems = localStorage.getItem('items');
    const parsedItems = JSON.parse(savedItems || '');
    const { customer } = useContext(CustomerContext);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [addAddress, setAddAddress] = useState<boolean>((customer?.addresses?.length || 0) > 0);
    const [address, setAddress] = useState<Address | undefined>();
    const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
    const { selectedCity, setSelectedCity, selectedRegion, setSelectedRegion, regions, cities, barangays } = useAddress();
    const isDark = useDarkmode();

    const subtotal : number = useMemo(() => {
        return orderItems?.reduce((total, item) => item.lineTotal + total, 0) ?? 0
    }, [orderItems])

    const shipping_fee : number = useMemo(() => {
        if(orderItems?.length > 0 && selectedAddress?.region) {
            const weight = orderItems.reduce((total, item) => item.weight + total, 0)
            return calculateShippingFee(weight, selectedAddress.region)
        }
        return 0
    }, [selectedAddress?.region, orderItems])

    const total : number = useMemo(() => {
        return (orderItems?.reduce((total, item) => item.lineTotal + total, 0) ?? 0 ) + shipping_fee
    }, [orderItems, shipping_fee])

    const proceed = () => {
        const order = {
            order_source: 'Website',
            shipping_fee: 0,
            subtotal: orderItems?.reduce((total, item) => item.lineTotal + total, 0) ?? 0,
            total: orderItems?.reduce((total, item) => item.lineTotal + total, 0) ?? 0,
            customer: {
                customer_id: customer?._id,
                email: customer?.email,
                firstname: customer?.firstname || '',
                lastname: customer?.lastname || '',
            },
            payment_method: "Cash",
            status: "Pending"
        }
    }

    useEffect(() => {
        const getProducts = async () => {
            const items = await Promise.all(parsedItems.map(async (item : Cart) => {
                const response = await fetchData(`/api/product/${item.product_id}`);

                if(response.success){
                    const product : Product = response.product
                    const variant = product.variants.filter(variant => variant._id === item.variant_id)[0]
                    
                    if(product.product_type === 'Variable' && !variant) return null
                    
                    return {
                        product_id: item.product_id,
                        variant_id: item.variant_id,
                        attributes: product.product_type === 'Single' ? null : variant.attributes,
                        stock: product.product_type === 'Single' ? product.stock : variant.stock,
                        product_name: product.product_name,
                        quantity: item.quantity,
                        price: product.product_type === 'Single' ? product.price : variant.price,
                        lineTotal: product.product_type === 'Single' ? (product.price ?? 0) * item.quantity : (variant.price ?? 0) * item.quantity,
                        image: typeof product?.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                            ? product.thumbnail.imageUrl
                                : typeof product?.thumbnail === 'string'
                                ? product.thumbnail
                            : '/photo.png',
                        status: 'Unfulfilled',
                        weight: product.weight
                    }
                }

                return null
            }).filter((item : any) => item))

            setOrderItems(items);
        }

        getProducts();
    }, [])

    const handleRegionChange = (value : string) => {
        const selectedCode = value;
        const selectedRegion = regions.find((city: any) => city.code === selectedCode);
        setSelectedRegion(selectedCode);
        setSelectedCity('');

        if (selectedRegion) setAddress((prev) => ({...prev!, region: selectedRegion.name}));
    };

    const handleCityChange = (value : string) => {
        const selectedCode = value;
        const selectedCity = cities.find((city: any) => city.code === selectedCode);
        setSelectedCity(selectedCode);

        if (selectedCity) setAddress((prev) => ({ ...prev!, city: selectedCity.name,}));
    };

    const handleBarangayChange = (value: string) => {
        setAddress((prev) => ({ ...prev!, barangay: value }));
    };

    return (
        <div className={cn("grid grid-cols-[2fr_1.5fr] gap-5 transition-colors duration-600 pt-30 pb-10 px-10", isDark && 'bg-[#121212]')}>
            <div className="flex-1 flex flex-col gap-5">
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                <h1 className="text-3xl font-bold text-red-500">Checkout</h1>
                <Card>
                    <div className={cn("flex items-center gap-5 pb-5 border-b border-gray-300", isDark && 'border-gray-500')}>
                        <h1 className={cn("text-xl font-bold", isDark && 'text-white')}>Order Summary</h1>
                        <CustomizedChip label={`${orderItems.length} items`} />
                    </div>
                    {orderItems?.map((item) => (
                        <div className={cn("flex items-center gap-5 py-5 border-b border-gray-300", isDark && 'border-gray-500')}>
                            <img className="w-25 h-25" src={item.image || '/photo.png'} alt="" />
                            <div className="flex flex-col gap-5">
                                <h1 className="font-bold">{item.product_name}</h1>
                                <p>Quantity: {item.quantity}</p>
                                <div className="flex gap-2">
                                    {Object.values(item?.attributes || {}).map(attribute => <CustomizedChip label={attribute} />)}
                                </div>
                            </div>
                        </div>
                    ))}
                </Card>
                <Card className="">
                    <div className="grid grid-cols-2 gap-5">
                        <strong>Subtotal</strong>
                        <strong className="text-right">₱{formatNumber(subtotal ?? 0)}</strong>
                        <p>Shipping fee</p>
                        <p className="text-right">₱{formatNumber(shipping_fee ?? 0)}</p>
                    </div>
                    <div className={cn("grid grid-cols-2 font-bold text-2xl mt-5 pt-3 border-t border-gray-300", isDark && 'border-gray-500')}>
                        <h1>Total</h1>
                        <h1 className="text-right">₱{formatNumber(total)}</h1>
                    </div>
                </Card>
            </div>
            <Card className="pt-5 py-10 px-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg">Delivery</h1>
                {addAddress ? <div className={cn("rounded-md flex flex-col gap-5 p-3 bg-gray-100", isDark && 'bg-[#353535]')}>
                    <div className="flex gap-5">
                    <RedTextField 
                        value={address?.firstname || ''} 
                        label="Firstname" 
                    />
                    <RedTextField 
                        value={address?.lastname || ''} 
                        label="Lastname" 
                    />
                    </div>
                    <CustomizedSelect 
                        label="Region"
                        value={selectedRegion}
                        menu={regions.map((region) => ({ value: region.code, label: region.name }))}
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
                        value={address?.barangay}
                        menu={barangays.map((barangay) => ({ value: barangay, label: barangay }))}
                        onChange={(e) => handleBarangayChange(e.target.value as string)}
                    />}
                    <RedTextField 
                        label="Street, Building, House No." 
                        fullWidth 
                        value={address?.street || ''}
                        onChange={(e) => setAddress((prev) => ({ ...prev!, street: e.target.value}))}
                    />
                    <div>
                        <label className={`mb-2 block text-sm font-medium ${isDark ? 'text-[#919191]' : 'text-gray-400'}`}>
                            Phone (Optional)
                        </label>
                        <PhoneInput
                            country={'ph'}
                            onlyCountries={['ph']}
                            specialLabel=""
                            value={address?.phone || ''}
                            dropdownStyle={{ color: 'black'}}
                            containerStyle={{ width: '100%', height: '55px', color: isDark ? 'gray' : 'black'  }}
                            inputStyle={{
                                width: '100%',
                                height: '55px',
                                backgroundColor: isDark ? '#313131' : '#fff',
                                color: isDark ? 'white' : 'black',
                            }}
                            onChange={(value) => setAddress((prev) => ({ ...prev!, phone: value}))}
                    />
                    </div>
                    <div className="flex justify-end items-center gap-5">
                        <Button 
                            variant="outlined" 
                            sx={{ border: 1, borderColor: isDark ? 'white' : 'gray', color: isDark ? 'white' : 'gray'}}
                            onClick={() => setAddAddress(false)}
                        >Close</Button>
                        <RedButton>Save</RedButton>
                    </div>
                </div> : 
                
                <button 
                    className={cn("w-full border flex items-center justify-between cursor-pointer gap-5 rounded-md px-5 py-3 border-gray-300 hover:bg-gray-100", isDark && 'border-gray-500 hover:bg-gray-500')}
                    onClick={() => setAddAddress(true)}
                >
                    <div className="flex items-center gap-3">
                        <LocationPinIcon />
                        Add Address
                    </div>
                    <AddIcon />
                </button>}
            </Card>
        </div>
    )
}

export default CheckoutPage