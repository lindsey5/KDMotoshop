import React, { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import { Button, IconButton, Pagination } from "@mui/material";
import { SearchField } from "../../components/Textfield";
import { RedButton } from "../../components/Button";
import AddIcon from '@mui/icons-material/Add';
import AddOrderModal from "../../components/order/AddOrder";
import { confirmDialog, successAlert } from "../../utils/swal";
import OrderContainer from "../../components/order/OrderContainer";
import { formatNumber } from "../../utils/utils";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from "react-router-dom";

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
    const [orders, setOrders] = useState<Sale[]>([]);
    const [total, setTotal] = useState<number>(0);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        const response = await fetchData('/api/category');
        if(response.success) setCategories(response.categories)
    }

    useEffect(() => {
        setTotal(orders.reduce((total, order) => order.sales + total,0));
    }, [orders])

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
            setOrders(prev => {
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
                            sales: product.price || 0
                        }]

                    }

                    return prev.map(o => o.product_id === product._id ? ({...o, quantity: o.quantity + 1, sales: (o.quantity + 1) * o.price}) : o)
                })

            successAlert('Order Added', 'Order successfully added');
        }
    }

    const closeProduct = () => {
        setSelectProduct(undefined);
    }

    const clear = async () => {
        if(await confirmDialog('Remove all items?', '')){
            setOrders([])
        }
    }

    return <div className="flex h-full bg-gray-100 gap-5">
        {selectedProduct && <AddOrderModal 
            selectedProduct={selectedProduct} 
            setOrders={setOrders}
            close={closeProduct}
        />}
        <div className="flex-1 flex flex-col p-5">
            <div className="flex items-center mb-4 gap-5">
                <IconButton onClick={() => navigate('/admin/orders')}>
                    <ArrowBackIosNewIcon />
                </IconButton>
                <h1 className="font-bold text-3xl">Create Order</h1>
            </div>
            <div className="flex justify-between items-center">
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
                    sx={{ color: '#292929', backgroundColor: '#d8d8d8', fontWeight: 'bold' }}
                >Add customer</Button>
                <Button sx={{ color: 'red' }} onClick={clear}>Clear</Button>
            </div>
            <div className="flex-grow min-h-0 overflow-y-auto">
            {orders.map((order, index) => <OrderContainer order={order} index={index} setOrders={setOrders}/>)}
            </div>
            <div className="flex flex-col gap-5 p-5 border-t-1 border-gray-300">
                <div className="flex justify-between mb-4">
                    <h1 className="font-bold text-2xl">Total</h1>
                    <h1 className="font-bold text-2xl">₱{formatNumber(total)}</h1>
                </div>
                <RedButton>Proceed</RedButton>
            </div>
        </div>
    </div>
}

export default CreateOrderPage