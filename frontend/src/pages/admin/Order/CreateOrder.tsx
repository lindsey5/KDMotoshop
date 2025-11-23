import React, { useMemo, useState } from "react";
import BreadCrumbs from "../../../components/BreadCrumbs";
import { Title } from "../../../components/text/Text";
import PageContainer from "../ui/PageContainer"
import { RedTextField } from "../../../components/Textfield";
import { useDebounce } from "../../../hooks/useDebounce";
import useFetch from "../../../hooks/useFetch";
import { cn, formatNumberToPeso } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import ProductModal from "./ui/ProductModal";
import { RedButton } from "../../../components/buttons/Button";
import { CustomizedSelect, StatusSelect } from "../../../components/Select";
import { Package } from "lucide-react";
import CreateOrderItemContainer from "./ui/CreateOrderItemContainer";
import ProductSearchItem from "./ui/CreateOrderSearchItem";
import { Backdrop, Button, CircularProgress, Modal } from "@mui/material";
import Card from "../../../components/Card";
import { useAddress } from "../../../hooks/useAddress";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";
import { postData } from "../../../services/api";
import type e from "express";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Create Order', href: '/admin/orders/create' }
]

const OrderState : Order = {
    order_source: 'Facebook',
    total: 0,
    subtotal: 0,
    status: 'Delivered',
    customer: {
        firstname: '',
        lastname: '',
        phone: '',
        email: ''
    },
    shipping_fee: 0,
    payment_method: 'CASH',
}

interface OtherOrderInfoModalProps{
    open: boolean;
    close: () => void;
    order: Order;
    createNewOrder: () => Promise<void>;
    setOrder: React.Dispatch<React.SetStateAction<Order>>
}

const OtherOrderInfoModal = ({ open, close, order, setOrder, createNewOrder } : OtherOrderInfoModalProps) => {
    const {
        selectedCity,
        setSelectedCity,
        selectedRegion,
        setSelectedRegion,
        regions,
        cities,
        barangays,
    } = useAddress();

    const handleRegionChange = (value: string) => {
        const selected = regions.find((region: any) => region.code === value);

        setSelectedRegion(value);
        setSelectedCity("");

        setOrder(prev => ({
            ...prev,
            address: {
                ...prev.address!,
                region: selected?.name || "",
                city: "",
                barangay: "",
            }
        }));
    };

    const handleCityChange = (value: string) => {
        const selected = cities.find((city: any) => city.code === value);
        setSelectedCity(value);
        setOrder(prev => ({
            ...prev,
            address: {
                ...prev.address!,
                city: selected ? selected.name : "",
                barangay: "",
            }
        }));
    };

    const handleBarangayChange = (value: string) => {
        setOrder(prev => ({
            ...prev,
            address: {
                ...prev.address!,
                barangay: value,
            }
        }));
    };
    
    return (
        <Modal
            open={open} 
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1}}
            onClose={close}
        >
            <Card className="w-full md:max-w-[60%] space-y-5">
                <h1 className="font-bold text-xl">Enter Order Information</h1>
                <div className="grid grid-cols-2 gap-5">
                    <RedTextField 
                        placeholder="Enter Order ID"
                        label="Order ID (Optional)"
                        onChange={(e) => setOrder(prev => ({ ...prev, order_id: e.target.value }))}
                        value={order.order_id}
                    />
                    <RedTextField 
                        type="number"
                        label="Customer Phone Number"
                        placeholder="+63 XXX XXX XXXX"
                        value={order.customer?.phone}
                        onChange={(e) =>{
                            const value = e.target.value.slice(0, 13);
                            setOrder(prev => ({ ...prev, customer: { ...prev.customer!, phone: value}}))
                        }}
                    />
                    <RedTextField 
                        placeholder="Enter Customer Firstname"
                        label="Customer Firstname"
                        onChange={(e) => setOrder(prev => ({ ...prev, customer: { ...prev.customer!, firstname: e.target.value}}))}
                        value={order.customer?.firstname}
                    />
                    <RedTextField 
                        placeholder="Enter Customer Lastname"
                        label="Customer Lastname"
                        onChange={(e) => setOrder(prev => ({ ...prev, customer: { ...prev.customer!, lastname: e.target.value}}))}
                        value={order.customer?.lastname}
                    />
                    <CustomizedSelect
                        label="Region"
                        value={selectedRegion}
                        menu={regions.map((region: any) => ({
                            value: region.code,
                            label: region.name,
                        }))}
                        onChange={(e) => handleRegionChange(e.target.value as string)}
                        />
                        
                    <CustomizedSelect
                        label="City/Municipality"
                        disabled={!selectedRegion}
                        value={selectedCity}
                        menu={cities.map((city: any) => ({
                        value: city.code,
                        label: city.name,
                        }))}
                        onChange={(e) => handleCityChange(e.target.value as string)}
                    />

                    <CustomizedSelect
                        label="Barangay"
                        disabled={!selectedCity}
                        value={order.address?.barangay}
                        menu={barangays.map((barangay: any) => ({
                        value: barangay,
                        label: barangay,
                        }))}
                        onChange={(e) => handleBarangayChange(e.target.value as string)}
                    />
                    <RedTextField 
                        multiline
                        rows={3}
                        label="Street"
                        placeholder="House number, street name, building"
                        value={order.address?.street}
                        onChange={(e) => setOrder(prev => ({...prev, address: ({...prev.address!, street: e.target.value})}))}
                        inputProps={{ maxLength: 100 }}
                    />
                </div>
                <div className="flex justify-end gap-5">
                    <Button
                        variant="outlined"
                        onClick={close}
                        sx={{ color: 'gray', borderColor: 'gray' }}
                    >
                        Close
                    </Button>
                    <RedButton 
                        disabled={
                            !order.customer?.firstname ||
                            !order.customer?.lastname ||
                            !order.customer.phone || 
                            !order.address?.street || 
                            !order.address?.barangay || 
                            !order.address?.city ||
                            !order.address.region 
                        }
                        onClick={async () => await createNewOrder()}
                    >Create Order</RedButton>
                </div>
            </Card>

        </Modal>
    )
}

const CreateOrderPage = () => {
    const isDark = useDarkmode();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debounceSearchTerm = useDebounce(searchTerm, 500);
    const [focused, setFocused] = useState<boolean>(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [order, setOrder] = useState<Order>(OrderState);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data } = useFetch(`/api/products?searchTerm=${debounceSearchTerm}&page=1&limit=30`)
    
    const handleBlur = () => {
        setTimeout(() => {
            setFocused(false);
        }, 200);
    };

    const addItem = (product : Product, sku?: string) => {
        if(product.product_type === 'Single'){
            const isExist = orderItems.findIndex(item => item.sku === product.sku) !== -1;
            if(isExist){
                setOrderItems(prev => prev.map((item) => (
                    item.sku === product.sku ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.price } : item
                )))
            }else{
                setOrderItems(prev => ([
                    ...prev,
                    {
                        status: "Unfulfilled",
                        product_id: product._id || '',
                        sku: product.sku || '',
                        product_type: product.product_type || 'Single',
                        attributes: {},
                        product_name: product.product_name || '',
                        quantity: 1,
                        stock: product.stock || 0,
                        price: product.price || 0,
                        lineTotal: (product.price ?? 0) * 1,
                        image: product && typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                                ? product.thumbnail.imageUrl
                                : null,
                    }
                ]))
            }

        }else{
            if(!sku){
                setSelectedProduct(product);
                return;
            }

            const variant = product.variants.find(v => v.sku === sku);
            if(!variant) return;
            const isExist = orderItems.findIndex(item => item.sku === sku) !== -1;
            if(isExist){
                setOrderItems(prev => prev.map((item) => (
                    item.sku === sku ? { ...item, quantity: item.quantity + 1, lineTotal: (item.quantity + 1) * item.price } : item
                )))
            }else{
                setOrderItems(prev => ([
                    ...prev,    
                    {
                        status: "Unfulfilled",
                        product_id: product._id || '',
                        sku: variant.sku || '',
                        product_type: product.product_type,
                        attributes: variant.attributes,
                        product_name: product.product_name || '',
                        quantity: 1,
                        stock: variant.stock || 0,
                        price: variant.price || 0,
                        lineTotal: (variant.price ?? 0)* 1,
                        image: product && typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                                ? product.thumbnail.imageUrl
                                : null,
                    }
                ]))
            }
        }
    }

    const total = useMemo(() => {
        return orderItems.reduce((total, item) => item.lineTotal + total ,0);
    }, [orderItems])

    const isFieldsValid = useMemo(() => {
        return orderItems.every(item => item.price !== 0 && item.quantity !== 0)
    }, [orderItems])

    const createNewOrder = async () => {
        if(await confirmDialog('Place order?', '', isDark, "success",)){
            setLoading(true)
            const response = await postData('/api/orders', { order: {...order, subtotal: total, total}, orderItems});
            setLoading(false)
            if(!response.success){
                await errorAlert('Error', response.message, isDark);
                return;
            }
            await successAlert('Success', 'Order Successfully Created.');
            window.location.reload();
        }

    }

    return (
        <PageContainer className="h-full flex flex-col gap-5">
            <Backdrop
                sx={{ color: '#fff', zIndex: 10 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {selectedProduct && <ProductModal 
                selectedProduct={selectedProduct}
                close={() => setSelectedProduct(undefined)}
                addItem={addItem}
            />}
            <div>
                <Title className="mb-4">Create Order</Title>
                <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            </div>

            <div className="flex gap-10 items-center">
                <div className="flex-1 relative">
                    <RedTextField 
                        placeholder="Search Product"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={handleBlur}
                    />
                    {focused && (
                        <div className={cn("absolute top-full left-0 w-full bg-white shadow-md border rounded-md max-h-60 overflow-y-auto z-10", isDark && 'bg-[#1e1e1e] border-gray-600')}>
                            {data?.products?.length > 0 ? (
                                data.products.map((product: Product) => <ProductSearchItem key={product._id} product={product} addItem={addItem}/>)
                            ) : (
                                <div className="p-2 text-gray-500">No products found</div>
                            )}
                        </div>
                    )}
                </div>
                <div className="w-[200px]">
                    <CustomizedSelect 
                        label="Payment Method"
                        value={order.payment_method}
                        fullWidth
                        onChange={(e) => setOrder(prev => ({...prev, payment_method: e.target.value as Order['payment_method']}))}
                        menu={['CASH', 'GCASH', 'PAYMAYA', "CARD"].map(method => ({ value: method, label: method }))}
                    />
                </div>
                <div className="w-[200px]">
                    <StatusSelect 
                        value={order.status}
                        onChange={(e) => setOrder(prev => ({ ...prev, status: e.target.value as Order['status']}))}
                        menu={[
                            { value: 'Pending', label: 'Pending', color: 'orange' },
                            { value: 'Confirmed', label: 'Confirmed', color: 'green' },
                            { value: 'Delivered', label: 'Delivered', color: 'purple' },
                        ]}
                    />
                </div>
                <div className="w-[250px]">
                    <CustomizedSelect
                        label="Order Channel"
                        value={order.order_source}
                        onChange={(e) => setOrder(prev => ({...prev, order_source: e.target.value as Order['order_source']}))}
                        menu={['Facebook', 'Shopee', 'Lazada', 'Tiktok'].map(method => ({ value: method, label: method }))}
                    />
                </div>
            </div>
            {orderItems.length ? (
                <div className="flex flex-col gap-5 max-h-full overflow-y-auto p-5">
                    {orderItems.map((item) => (
                        <CreateOrderItemContainer key={item.sku} orderItem={item} setOrderItems={setOrderItems}/>
                    ))}
                </div>
            ) : 
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
                <Package className="w-20 h-20 mb-4" />
                <p className="text-center text-gray-400 text-lg">Add Products to Create an Order</p>
            </div>
            }
            <div className="flex gap-4 items-center justify-end">
                <p className="text-lg font-bold">Total: {formatNumberToPeso(total)}</p>
                <RedButton
                    onClick={() => setShowModal(true)}
                    disabled={orderItems.length === 0 || !isFieldsValid}
                >Proceed</RedButton>
            </div>
            <OtherOrderInfoModal 
                open={showModal}
                close={() => setShowModal(false)}
                order={order}
                setOrder={setOrder}
                createNewOrder={createNewOrder}
            />
        </PageContainer>
    )
}

export default CreateOrderPage;