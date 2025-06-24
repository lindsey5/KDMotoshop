import React, { useEffect, useState } from "react"
import { fetchData, postData } from "../../services/api";
import { Button,Pagination } from "@mui/material";
import { SearchField } from "../../components/Textfield";
import { RedButton } from "../../components/Button";
import AddIcon from '@mui/icons-material/Add';
import AddOrderModal from "../../components/order/AddOrder";
import { confirmDialog, successAlert } from "../../utils/swal";
import OrderContainer from "../../components/order/OrderContainer";
import { formatNumber } from "../../utils/utils";
import OrderInformationModal from "../../components/order/OrderInformation";
import BreadCrumbs from "../../components/BreadCrumbs";

const OrderState : Order = {
    total: 0,
    subtotal: 0,
    status: 'Pending',
    customer: {
        firstname: '',
        lastname: '',
        phone: '',
        email: ''
    },
    payment_method: 'Cash',
    note: '',
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectProduct] = useState<Product | undefined>();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>(OrderState);

    const fetchCategories = async () => {
        const response = await fetchData('/api/category');
        if(response.success) setCategories(response.categories)
    }

    useEffect(() => {
        setOrder(prev => (
            { ...prev, 
                subtotal: orderItems
                .reduce((total, item) => item.lineTotal + total,0),
                total: orderItems
                .reduce((total, item) => item.lineTotal + total,0)
            }
        ))
    }, [orderItems])

    useEffect(() => {
        fetchProducts();
        fetchCategories();
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
        const response = await fetchData(`/api/product?page=${pagination.page}&limit=100&searchTerm=${pagination.searchTerm}&category=${selectedCategory}`);

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
                            image: selectedProduct && typeof selectedProduct.thumbnail === 'object' && selectedProduct.thumbnail !== null && 'imageUrl' in selectedProduct.thumbnail
                                ? selectedProduct.thumbnail.imageUrl
                                : selectedProduct && typeof selectedProduct.thumbnail === 'string'
                                    ? selectedProduct.thumbnail
                                    : '/photo.png',
                            quantity: 1,
                            price: product.price || 0,
                            lineTotal: product.price || 0
                        }]

                    }

                    return prev.map(o => o.product_id === product._id ? ({...o, quantity: o.quantity + 1, lineTotal: (o.quantity + 1) * o.price}) : o)
                })

            successAlert('Order Added', 'Order successfully added');
        }
    }

    const closeProduct = () => {
        setSelectProduct(undefined);
    }

    const clear = async () => {
        if(await confirmDialog('Remove all items?', '')){
            setOrderItems([])
        }
    }

    const proceed = async () => {
        if(!order.customer.firstname || !order.customer.lastname || (order.address && Object.values(order.address).some(value => !value))){
            setShowCustomerModal(true);
        }else{
            if(await confirmDialog('Save order?', '', "success")){
                const response = await postData('/api/order', { order, orderItems});
                if(response.success){
                    successAlert('Order Created', 'Order successfully created');
                    setOrderItems([]);
                    setOrder(OrderState);
                    setPagination({ ...pagination, page: 1, searchTerm: '' });
                    setSelectedCategory('All');
                }
            }
        }

    }

    return <div className="flex h-full bg-gray-100 gap-5">
        {selectedProduct && <AddOrderModal 
            selectedProduct={selectedProduct} 
            setOrderItems={setOrderItems}
            close={closeProduct}
        />}
        <OrderInformationModal
            open={showCustomerModal} 
            onClose={() => setShowCustomerModal(false)}
            order={order}
            setOrder={setOrder}
        />
        <div className="flex-1 flex flex-col p-5">
            <h1 className="font-bold text-3xl mb-4">Create Order</h1>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs} />

            <div className="flex justify-between items-center mt-6">
                <SearchField 
                    onChange={(e) => setPagination({...pagination, searchTerm: e.target.value })}
                    sx={{ maxWidth: '450px', backgroundColor: 'white'}}
                    placeholder="Search by Product name, SKU, Category..." 
                />
                <Pagination count={pagination.totalPages} onChange={handlePage} />
            </div>

            {/* Categories*/}
            <div className="bg-white rounded-md border-1 border-gray-300 shadow-lg mt-6 p-5 flex items-center gap-5">
                <Button
                    variant={selectedCategory === 'All' ? 'outlined' : 'text'}   
                    onClick={() => setSelectedCategory('All')}
                    sx={{ 
                        ...(selectedCategory === 'All' ? 
                            { backgroundColor: '#fee2e2', color: 'red', borderColor: 'red', borderWidth: 2} :
                            { color: 'black', ":hover": { backgroundColor: '#fee2e2', color: 'red' } }
                        ) 
                    }}
                >All</Button>
                {categories.map(category => (
                    <Button
                        key={category._id}
                        variant={selectedCategory === category.category_name ? 'outlined' : 'text'}   
                        onClick={() => setSelectedCategory(category.category_name)}
                        sx={{ 
                            ...(selectedCategory === category.category_name ? 
                                { backgroundColor: '#fee2e2', color: 'red', borderColor: 'red', borderWidth: 2} :
                                { color: 'black', ":hover": { backgroundColor: '#fee2e2', color: 'red' } }
                            ) 
                        }}
                    >{category.category_name}</Button>
                ))}
            </div>
            
            {/* Products */}
            <div className="flex flex-col flex-grow min-h-0 mt-4 overflow-y-auto">
                <div className="2xl:grid-cols-5 grid grid-cols-3 flex flex-wrap gap-5 p-3">
                    {products.map(product => (
                    <div key={product._id} className="bg-white p-5 flex flex-col gap-4 border-1 border-gray-300 shadow-md rounded-md">
                        <img 
                            className="bg-gray-100 w-full h-40 2xl:h-50"
                            src={
                                typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                                ? product.thumbnail.imageUrl
                                : typeof product.thumbnail === 'string'
                                    ? product.thumbnail
                                    : '/photo.png'
                            }
                        />
                        <h1 className="font-bold text-lg">{product.product_name}</h1>
                        <h1 className="font-bold text-lg">₱{formatNumber(product.price ? product.price :  Math.min(...product.variants.map(v => v.price || 0)))}</h1>
                        <RedButton onClick={() => addOrder(product)}>Add</RedButton>
                    </div>
                    ))}
                </div>
            </div>

        </div>

        <div className="w-[400px] bg-white flex flex-col border-l-1 border-gray-300">
            <div className="flex justify-between p-5 border-b-1 border-gray-300">
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
            <div className="flex flex-col gap-5 p-5 border-t-1 border-gray-300">
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
    </div>
}

export default CreateOrderPage