import { useContext, useEffect, useMemo, useState } from "react";
import { fetchData, postData, updateData } from "../../../services/api";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils";
import Card from "../../../components/cards/Card";
import { CustomerContext } from "../../../context/CustomerContext";
import LocationPinIcon from '@mui/icons-material/LocationPin';
import AddIcon from '@mui/icons-material/Add';
import { useAddress } from "../../../hooks/useAddress";
import { CustomizedSelect } from "../../../components/Select";
import { RedTextField } from "../../../components/Textfield";
import { RedButton } from "../../../components/buttons/Button";
import { Button, RadioGroup } from "@mui/material";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { CustomizedChip } from "../../../components/Chip";
import PhoneInput from "react-phone-input-2";
import { calculateShippingFee } from "../../../utils/shipping";
import CheckoutItemContainer from "../../../components/containers/customer/CheckoutItem";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";
import PaymentSummaryCard from "../../../components/cards/customer/PaymentSummary";
import AddressContainer from "../../../components/containers/customer/AddressContainer";
import { RedRadio } from "../../../components/Radio";
import e from "cors";
import { Title } from "../../../components/text/Text";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Checkout', href: '/checkout' }
]

const addresssInitialState = {
    region: '',
    barangay: '',
    city: '',
    street: '',
    firstname: '',
    lastname: '',
    phone: '',
}

const CheckoutPage = () => {
    const savedItems = localStorage.getItem('items');
    const cartItems = localStorage.getItem('cart');
    const parsedCartItems = cartItems ? JSON.parse(cartItems) : null;
    const parsedItems = JSON.parse(savedItems || ''); 
    const { customer, setCustomer } = useContext(CustomerContext);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [addAddress, setAddAddress] = useState<boolean>(false);
    const [address, setAddress] = useState<Address>(addresssInitialState);
    const [selectedAddress, setSelectedAddress] = useState<number>(0);
    const { selectedCity, setSelectedCity, selectedRegion, setSelectedRegion, regions, cities, barangays } = useAddress();
    const isDark = useDarkmode();
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<string>('CASH');

    useEffect(() => {
        if(customer){
            setAddAddress((customer.addresses?.length || 0) < 1)
            setAddress(prev => ({...prev, firstname: customer.firstname, lastname: customer.lastname}))
        }
    }, [customer])

    const subtotal : number = useMemo(() => {
        return orderItems?.reduce((total, item) => item.lineTotal + total, 0) ?? 0
    }, [orderItems])

    const shipping_fee : number = useMemo(() => {
        if(orderItems?.length > 0 && customer?.addresses && customer?.addresses.length > 0) {
            return orderItems.reduce((total, item) => (item.quantity * calculateShippingFee(item.weight, (customer?.addresses?.[selectedAddress]?.region ?? ''))) + total, 0)
        }
        return 0
    }, [selectedAddress, orderItems, customer?.addresses])

    const total : number = useMemo(() => {
        return (orderItems?.reduce((total, item) => item.lineTotal + total, 0) ?? 0 ) + shipping_fee
    }, [orderItems, shipping_fee])
    
    const areFieldsFilled = useMemo(() => {
        return Object.entries(address)
            .every(([_, value]) => value !== '');
    }, [address])

    const saveAddress = async () => {
        setLoading(true)
        const data = {...customer!, addresses: [...customer?.addresses!, address]}
        const response = await updateData('/api/customer', data)
        if(response.success){
            setCustomer(data)
            setAddAddress(false)
            setAddress(addresssInitialState)
            setSelectedRegion('')
            setSelectedCity('')
            if((customer?.addresses?.length || 0) > 0) setSelectedAddress(0)
            successAlert('Address successfully save', '', isDark);
        }
        setLoading(false)
    }

    const proceed = async () => {
        if(await confirmDialog(paymentMethod === 'CASH' ? 'Place this Order?' :'Proceed to payment?', '', isDark, "success")){
            setLoading(true)
            const order = {
                order_source: 'Website',
                shipping_fee,
                subtotal,
                total,
                status: "Pending",
                customer: {
                    customer_id: customer?._id,
                    email: customer?.email,
                    firstname: address.firstname,
                    lastname: address.lastname,
                    phone: customer?.addresses?.[selectedAddress].phone
                },
                address: {
                    street: customer?.addresses?.[selectedAddress].street,
                    barangay: customer?.addresses?.[selectedAddress].barangay,
                    city: customer?.addresses?.[selectedAddress].city,
                    region: customer?.addresses?.[selectedAddress].region
                },
                payment_method: paymentMethod,
            };
            const response = await postData(paymentMethod === 'CASH' ? '/api/order/customer' : '/api/payment', {
                order, 
                orderItems, 
                cart: parsedCartItems
            });

            if(response.success) {
                if(paymentMethod === 'CASH'){
                    await successAlert('Order successfully placed', 'Thank you for choosing our service!', isDark);
                    window.location.href = `/order/${response.order._id}`
                }else{
                    window.open(response.checkout_url, '_blank')
                }
            }
            else errorAlert(response.message, '', isDark)
            
            setLoading(false)
        }
    }

    useEffect(() => {
        const getProducts = async () => {
            const items = await Promise.all(parsedItems.map(async (item : any) => {
                const response = await fetchData(`/api/product/${item.product_id}`);

                if(response.success){
                    const product : Product = response.product
                    const variant = product.variants.filter(variant => variant._id === item.variant_id)[0]
                    
                    if(product.product_type === 'Variable' && !variant) return null

                    const stock = product.product_type === 'Single' ? product.stock : variant.stock

                    return {
                        product_id: item.product_id,
                        variant_id: item.variant_id,
                        attributes: product.product_type === 'Single' ? null : variant.attributes,
                        stock: stock,
                        product_name: product.product_name,
                        quantity: item.quantity > (stock ?? 0) ? stock : item.quantity,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAddress(Number(event.target.value));
    };

    const handlePaymentMethod = (event: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(event.target.value)

    const removeAddress = async (index : number) => {
        if(await confirmDialog('Remove this address?', '', isDark)){
            setLoading(true)
            const data = {...customer!, addresses: customer?.addresses?.filter((_, i) => i !== index)}
            const response = await updateData('/api/customer', data)
            if(response.success){
                setCustomer(data)
                successAlert('Address successfully removed', '', isDark)
                if(data.addresses?.length === 1) setSelectedAddress(0);
            }
            setLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col lg:flex-row gap-5 lg:items-start transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <div className="flex-2 flex flex-col gap-5">
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                <Title>Checkout</Title>
                <Card>
                    <div className={cn("flex items-center gap-5 pb-5 border-b border-gray-300", isDark && 'border-gray-500')}>
                        <h1 className={cn("text-xl font-bold", isDark && 'text-white')}>Order Summary</h1>
                        <CustomizedChip label={`${orderItems.length} items`} />
                    </div>
                    {orderItems?.map((item, i) => <CheckoutItemContainer key={i} item={item} />)}
                </Card>
                <PaymentSummaryCard shipping_fee={shipping_fee} subtotal={subtotal} total={total}/>
            </div>
            <Card className="p-5 lg:pt-5 lg:py-10 lg:px-10 flex flex-1 flex-col gap-5">
                <h1 className="font-bold text-lg">Delivery</h1>
                <RadioGroup
                    className="flex flex-col gap-5"
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={handleChange} 
                >
                {customer?.addresses?.map((address, index) => (
                    <AddressContainer 
                        key={index}
                        address={address} 
                        selectedAddress={selectedAddress} 
                        index={index}
                        remove={removeAddress}
                    />
                ))}
                </RadioGroup>
                {addAddress ? <div className={cn("rounded-md flex flex-col gap-5 p-3 bg-gray-100", isDark && 'bg-[#353535]')}>
                    <div className="flex gap-5">
                    <RedTextField 
                        value={address?.firstname || ''} 
                        label="Firstname" 
                        onChange={(e) => setAddress(prev => ({...prev, firstname: e.target.value}))}
                    />
                    <RedTextField 
                        value={address?.lastname || ''} 
                        label="Lastname" 
                        onChange={(e) => setAddress(prev => ({...prev, lastname: e.target.value}))}
                    />
                    </div>
                    <CustomizedSelect 
                        label="Region"
                        value={selectedRegion}
                        menu={regions.map((region) => ({ value: region.code, label: region.name }))}
                        onChange={(e) => handleRegionChange(e.target.value as string)}
                    />
                    {selectedRegion && <CustomizedSelect 
                        label="City/Municipalities"
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
                            Phone
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
                        {(customer?.addresses?.length ?? 0) > 0 && <Button 
                            variant="outlined" 
                            sx={{ border: 1, borderColor: isDark ? 'white' : 'gray', color: isDark ? 'white' : 'gray'}}
                            onClick={() => setAddAddress(false)}
                        >Close</Button>}
                        <RedButton 
                            onClick={saveAddress} 
                            disabled={!areFieldsFilled || loading}
                        >Save</RedButton>
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
                
                <strong>Payment Method</strong>
                <RadioGroup
                    className="flex flex-col gap-5"
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={paymentMethod}
                    name="radio-buttons-group"
                    onChange={handlePaymentMethod}
                >
                    <RedRadio label="Cash on delivery" value="CASH"/>
                    <div className="flex justify-between items-center">
                        <RedRadio label="E-Wallets / Card" value="ONLINE PAYMENT" />
                        <div className="flex gap-2">
                            <img className="w-8 h-6" src="/icons/gcash.jpeg" alt="gcash" />
                            <img className="w-8 h-6" src="/icons/maya.png" alt="gcash" />
                            <img className="w-9 h-6" src="/icons/mastercard.png" alt="gcash" />
                            <img className="w-8 h-6" src="/icons/visa.jpg" alt="gcash" />
                        </div>
                    </div>
                </RadioGroup>

                <RedButton 
                    onClick={proceed}
                    disabled={(customer?.addresses?.length ?? 0) < 1 || loading}
                >{paymentMethod === 'CASH' ? 'Place order' : 'Proceed to payment'}</RedButton>
            </Card>
        </div>
    )
}

export default CheckoutPage