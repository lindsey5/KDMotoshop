import React, { useEffect, useState } from "react"
import { fetchData, postData } from "../../../services/api";
import { Backdrop, Button,Pagination } from "@mui/material";
import { SearchField } from "../../../components/Textfield";
import { RedButton } from "../../../components/Button";
import AddIcon from '@mui/icons-material/Add';
import AddOrderModal from "../../../components/modals/AddOrder";
import { confirmDialog, successAlert } from "../../../utils/swal";
import OrderContainer from "../../../components/containers/admin/OrderContainer";
import { cn, formatNumber } from "../../../utils/utils";
import OrderInformationModal from "../../../components/modals/OrderInformation";
import BreadCrumbs from "../../../components/BreadCrumbs";
import CategoryFilter from "../../../components/cards/admin/CategoryFilter";
import ProductContainer from "../../../components/containers/admin/OrderProductContainer";
import CircularProgress from '@mui/material/CircularProgress';
import useDarkmode from "../../../hooks/useDarkmode";
import { Title } from "../../../components/text/Text";
import PageContainer from "../../../components/containers/admin/PageContainer";

const OrderState : Order = {
    order_source: 'Store',
    shipping_fee: 0,
    total: 0,
    subtotal: 0,
    status: 'Completed',
    customer: {
        firstname: '',
        lastname: '',
        phone: '',
        email: ''
    },
    payment_method: 'CASH',
}

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Create Order', href: '/admin/orders/create' }
]

const CreateOrderPage = () => {
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 1,
        page: 1,
        searchTerm: ''
    });
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectProduct] = useState<Product | undefined>();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>(OrderState);
    const [loading, setLoading] = useState<boolean>(false);
    const isDark = useDarkmode()

    useEffect(() => {
        setOrder(prev => (
            { ...prev, 
                subtotal: orderItems
                .reduce((total, item) => item.lineTotal + total,0),
                total: prev.shipping_fee + orderItems
                .reduce((total, item) => item.lineTotal + total,0)
            }
        ))
    }, [orderItems])

    useEffect(() => {
        fetchProducts();
    }, [pagination.page, selectedCategory])

    useEffect(() => {
        setSelectedCategory('All')
    }, [pagination.searchTerm])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 300); 
        
        return () => clearTimeout(delayDebounce);
    }, [pagination.searchTerm])

    const fetchProducts = async () => {
        const response = await fetchData(`/api/product/reserved?page=${pagination.page}&limit=100&searchTerm=${pagination.searchTerm}&category=${selectedCategory}`);

        if(response.success) {
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages,
            }))
            setProducts(response.products)
        }
    }

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    const addOrder = (product : Product) => {
        if(product.product_type === 'Variable'){
            setSelectProduct(product)
        }else{
            setOrderItems(prev => {
                    if(!prev.find(o => o.product_id === product._id)){

                        return [...prev, {
                            product_id: product._id || '',
                            product_name: product.product_name,
                            stock: product.stock || 0,
                            image: product && typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                                ? product.thumbnail.imageUrl
                                : null,
                            quantity: 1,
                            price: product.price || 0,
                            lineTotal: product.price || 0,
                            status: "Unfulfilled",
                            weight: product.weight,
                        }]
                    }

                    return prev.map(o => o.product_id === product._id ? ({...o, quantity: o.quantity + 1, lineTotal: (o.quantity + 1) * o.price}) : o)
                })

            successAlert('Order Added', 'Order successfully added', isDark);
        }
    }

    const closeProduct = () => {
        setSelectProduct(undefined);
    }

    const clear = async () => {
        if(await confirmDialog('Remove all items?', '', isDark)){
            setOrderItems([])
        }
    }

    const proceed = async () => {
        if(!order.customer.firstname || !order.customer.lastname || (order.address && Object.values(order.address).some(value => !value))){
            setShowCustomerModal(true);
        }else{
            if(await confirmDialog('Save order?', '', isDark, "success",)){
                setLoading(true)
                const response = await postData('/api/order', { order, orderItems});
                if(response.success){
                    successAlert('Order Created', 'Order successfully created', isDark);
                    setOrderItems([]);
                    setOrder(OrderState);
                    setPagination({ ...pagination, page: 1, searchTerm: '' });
                    setSelectedCategory('All');
                }
                setLoading(false)
            }
        }

    }

    useEffect(() => {
        setOrder(prev => ({...prev, total: prev.subtotal + prev.shipping_fee}))
    }, [order.shipping_fee])

    return <PageContainer className="flex h-full">
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        {selectedProduct && <AddOrderModal 
            selectedProduct={selectedProduct} 
            setOrderItems={setOrderItems}
            close={closeProduct}
        />}
        <OrderInformationModal
            open={showCustomerModal} 
            close={() => setShowCustomerModal(false)}
            order={order}
            setOrder={setOrder}
        />
        <div className="flex-1 flex flex-col p-5">
            <Title className="mb-4">Create Order</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs} />

            <div className="flex justify-between items-center mt-6">
                <SearchField 
                    onChange={(e) => setPagination({...pagination, searchTerm: e.target.value })}
                    sx={{ maxWidth: '450px' }}
                    placeholder="Search by Product name, SKU, Category..." 
                />
                <Pagination 
                    count={pagination.totalPages} 
                    onChange={handlePage} 
                />
            </div>

            {/* Categories*/}
            <CategoryFilter 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
            />
            
            {/* Products */}
            <div className="flex flex-col flex-grow min-h-0 mt-4 overflow-y-auto">
                <div className="2xl:grid-cols-5 grid grid-cols-3 flex flex-wrap gap-5 p-3">
                    {products.map(product => (
                        <ProductContainer 
                            product={product}
                            key={product._id}
                            addOrder={addOrder}
                        />
                    ))}
                </div>
            </div>

        </div>

        <div className={cn("w-[400px] flex flex-col border-l-1 border-gray-300 bg-white", isDark && 'bg-[#1e1e1e] border-gray-600')}>
            <div className={cn("flex justify-between p-5 border-b-1 border-gray-300", isDark && 'border-gray-600')}>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setShowCustomerModal(true)}
                    sx={{ color: '#292929', backgroundColor: '#d8d8d8', fontWeight: 'bold' }}
                >Add customer</Button>
                <Button 
                    sx={{ color: 'red' }} 
                    onClick={clear} 
                    disabled={orderItems.length === 0}
                >Clear</Button>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto">
            {orderItems.map((orderItem, index) => <OrderContainer orderItem={orderItem} index={index} setOrderItems={setOrderItems}/>)}
            </div>
            <div className={cn("flex flex-col gap-5 p-5 border-t-1 border-gray-300", isDark && 'border-gray-600')}>
                <div className={cn("flex flex-col gap-5 pb-5 border-b-1 border-gray-400", isDark && 'border-gray-600')}>
                    <div className="flex justify-between">
                        <strong>Subtotal</strong>
                        <strong>₱{formatNumber(order.subtotal)}</strong>
                    </div>
                    <div className="flex justify-between items-center"> 
                        <strong>Shipping fee</strong>
                        <input 
                            className="w-[70px] border-1 outline-none px-2 py-1 rounded-sm" 
                            type="number"
                            value={order.shipping_fee || ''}
                            onChange={(e) => setOrder(prev => ({...prev, shipping_fee: Number(e.target.value)}))}
                        />
                    </div>
                </div>
                <div className="flex justify-between mb-4">
                    <h1 className="font-bold text-2xl">Total</h1>
                    <h1 className="font-bold text-2xl">₱{formatNumber(order.total)}</h1>
                </div>
                <RedButton
                    onClick={proceed}
                    disabled={orderItems.length === 0}
                >Proceed</RedButton>
            </div>
        </div>
    </PageContainer>
}

export default CreateOrderPage