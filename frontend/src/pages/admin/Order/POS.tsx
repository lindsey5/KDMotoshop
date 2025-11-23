import React, { useCallback, useEffect, useMemo, useState } from "react"
import { postData } from "../../../services/api";
import { Backdrop, Badge, Button,IconButton } from "@mui/material";
import { SearchField } from "../../../components/Textfield";
import { RedButton } from "../../../components/buttons/Button";
import POSProductModal from "./ui/POSProductModal";
import { confirmDialog, successAlert } from "../../../utils/swal";
import OrderContainer from "./ui/OrderContainer";
import { cn, formatNumberToPeso } from "../../../utils/utils";
import BreadCrumbs from "../../../components/BreadCrumbs";
import CategoryFilter from "../ui/CategoryFilter";
import POSProductContainer from "./ui/POSProductContainer";
import CircularProgress from '@mui/material/CircularProgress';
import useDarkmode from "../../../hooks/useDarkmode";
import { Title } from "../../../components/text/Text";
import MenuIcon from '@mui/icons-material/Menu';
import PageContainer from "../ui/PageContainer";
import CloseIcon from '@mui/icons-material/Close';
import ReceiptModal from "./ui/ReceiptModal";
import useFetch from "../../../hooks/useFetch";
import { useDebounce } from "../../../hooks/useDebounce";
import CustomizedPagination from "../../../components/Pagination";
import { CustomizedSelect } from "../../../components/Select";

const OrderState : Order = {
    order_source: 'Store',
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

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Point of Sale', href: '/admin/pos' }
]

const POSPage = () => {
    const [page, setPage] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedProduct, setSelectProduct] = useState<Product | undefined>();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [order, setOrder] = useState<Order>(OrderState);
    const [loading, setLoading] = useState<boolean>(false);
    const isDark = useDarkmode()
    const [showSide, setShowSide] = useState<boolean>(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [payment, setPayment] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data : productsRes } = useFetch(`/api/products?page=${page}&limit=30&searchTerm=${searchDebounce}&category=${selectedCategory}`)

    const calculateTotal = useCallback(() => {
        setOrder(prev => (
            { ...prev, 
                subtotal: orderItems
                .reduce((total, item) => item.lineTotal + total,0),
                total: orderItems.reduce((total, item) => item.lineTotal + total,0)
            }
        ))
    }, [orderItems])

    useEffect(() => {
        calculateTotal()
    }, [orderItems])

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    const addOrder = (product : Product) => {
        if(product.product_type === 'Variable'){
            setSelectProduct(product)
        }else{
            setOrderItems(prev => {
                    if(!prev.find(o => o.product_id === product._id)){

                        return [...prev, {
                            product_id: product._id || '',
                            sku: product.sku ?? '',
                            product_type: product.product_type as "Single" | "Variable",
                            product_name: product.product_name,
                            stock: product.stock || 0,
                            image: product && typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                                ? product.thumbnail.imageUrl
                                : null,
                            quantity: 1,
                            price: product.price || 0,
                            lineTotal: product.price || 0,
                            status: "Unfulfilled",
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
        if(await confirmDialog('Place order?', '', isDark, "success",)){
            setLoading(true)
            const newOrder = {...order, change: payment - order.total, paymentAmount: payment };
            const response = await postData('/api/orders', { order: newOrder , orderItems});
            if(response.success){
                setLoading(false)
                setShowReceipt(true);
                setOrder(response.order);
            }
            setLoading(false)
        }

    }

    const closeReceipt = () => {
        setShowReceipt(false)
        setOrderItems([]);
        setOrder(OrderState);
        setPayment(0);
        setSelectedCategory('All');
    }

    useEffect(() => {
        setPage(1)
    }, [selectedCategory])

    const isQuantityValid = useMemo(() => {
        return orderItems.every(item => item.quantity !== 0)
    }, [orderItems])

    return <PageContainer className="flex h-full p-0">
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <ReceiptModal 
            open={showReceipt} 
            onClose={closeReceipt} 
            order={order} 
            orderItems={orderItems} 
            payment={payment}
            change={payment - order.total}
        />
        {selectedProduct && <POSProductModal
            selectedProduct={selectedProduct} 
            setOrderItems={setOrderItems}
            close={closeProduct}
        />}
        <div className="flex-1 flex flex-col p-5">
            <div className="flex justify-between gap-5 items-start">
                <div>
                    <Title className="mb-4">Point of Sale</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs} />
                </div>
                {!showSide && <div className="block xl:hidden">
                    <IconButton onClick={() => setShowSide(true)}>
                        <Badge badgeContent={orderItems.length} color="primary">
                            <MenuIcon sx={{ color: isDark ? 'white' : 'black'}} fontSize="large"/>
                        </Badge>
                    </IconButton>
                </div>}
            </div>
            

            <div className="flex flex-wrap gap-5 justify-between items-center mt-6">
                <SearchField 
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setPage(1)
                    }}
                    sx={{ maxWidth: '450px' }}
                    value={searchTerm}
                    placeholder="Search by Product name, SKU, Category..." 
                />
                <CustomizedPagination 
                    count={productsRes?.totalPages} 
                    onChange={handlePage} 
                    page={page}
                />
            </div>

            {/* Categories*/}
            <CategoryFilter 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory}
            />
            
            {/* Products */}
            <div className="flex flex-col flex-grow min-h-0 mt-4 overflow-y-auto">
                <div className="2xl:grid-cols-4 lg:grid-cols-3 grid grid-cols-2 flex flex-wrap gap-5 p-3">
                    {productsRes?.products.map((product : Product) => (
                        <POSProductContainer
                            product={product}
                            key={product._id}
                            addOrder={addOrder}
                        />
                    ))}
                </div>
            </div>

        </div>

        <div className={cn("w-[400px] fixed xl:static hidden right-0 inset-y-0 xl:flex flex-col border-l-1 border-gray-300 bg-white", isDark && 'bg-[#1e1e1e] border-gray-600', showSide && 'flex')}>
            <div className={cn("gap-10 flex items-center justify-between p-5 border-b-1 border-gray-300", isDark && 'border-gray-600')}>
                <CustomizedSelect 
                    label="Payment Method"
                    value={order.payment_method}
                    onChange={(e) => {
                        const paymentAmount = e.target.value !== 'CASH' ? order.total : 0;
                        setPayment(paymentAmount);
                        setOrder(prev => ({ ...prev, payment_method: e.target.value as Order['payment_method'] }))
                    }}
                    menu={['CASH', 'GCASH', 'PAYMAYA', "CARD"].map(method => ({ value: method, label: method }))}
                />
                <Button 
                    sx={{ color: 'red' }} 
                    onClick={clear} 
                    disabled={orderItems.length === 0}
                >Clear</Button>
                <div className="block xl:hidden">
                    <IconButton onClick={() => setShowSide(false)}>
                        <CloseIcon sx={{ color: isDark ? 'white' : 'black'}}/>
                    </IconButton>
                </div>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto">
            {orderItems.map((orderItem, index) => <OrderContainer key={index} orderItem={orderItem} index={index} setOrderItems={setOrderItems}/>)}
            </div>
            <div className={cn("flex flex-col gap-5 p-5 border-t-1 border-gray-300", isDark && 'border-gray-600')}>
                {order.order_source === 'Store' && <>
                <div className="flex justify-between items-center">
                    <h1 className="">Payment</h1>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value={payment || ''}
                        disabled={order.payment_method !== 'CASH'}
                        onChange={(e) => setPayment(Number(e.target.value))}
                        className={`w-[200px] px-3 py-2 rounded-md text-sm border transition outline-none bg-white text-gray-800 focus:border-gray-700disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300`}
                    />
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="">Change</h1>
                    {payment && order.total && <h1>{formatNumberToPeso(payment - order.total)}</h1>}
                </div>
                
                </>}
                <div className="flex justify-between mb-4">
                    <h1 className="font-bold text-2xl">Total</h1>
                    <h1 className="font-bold text-2xl">{formatNumberToPeso(order.total)}</h1>
                </div>
                <RedButton
                    onClick={proceed}
                    disabled={orderItems.length === 0 || payment < order.total || !isQuantityValid}
                >Place Order</RedButton>
            </div>
        </div>
    </PageContainer>
}

export default POSPage