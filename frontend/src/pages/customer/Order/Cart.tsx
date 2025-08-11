import { useContext, useMemo } from "react"
import BreadCrumbs from "../../../components/BreadCrumbs";
import Card from "../../../components/cards/Card";
import { CustomizedChip } from "../../../components/Chip";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn, formatNumber } from "../../../utils/utils";
import CartItemContainer from "../../../components/containers/customer/CartItem";
import { RedButton } from "../../../components/buttons/Button";
import { Navigate, useNavigate } from "react-router-dom";
import { Title } from "../../../components/text/Text";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { CustomerContext } from "../../../context/CustomerContext";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' }
]

const Cart = () => {
    const { cart, loading } = useSelector((state : RootState) => state.cart)
    const isDark = useDarkmode();
    const { customer, loading : customerLoading } = useContext(CustomerContext);
    const navigate = useNavigate();

    const selectedItem = useMemo(() => {
        const items = cart.filter(item => item.isSelected && item.stock !== 0)
        const total = items.reduce((total, item) => total + (item.price * item.quantity), 0)
        return { total, items }
    }, [cart])

    const proceedToCheckout = () => {
        const items = selectedItem.items.map(item => ({ product_id: item.product_id, variant_id: item.variant_id, quantity: item.quantity}))
        localStorage.setItem('items', JSON.stringify(items))
        localStorage.setItem('cart', JSON.stringify(selectedItem.items))
        navigate('/checkout')
    }

    if(!customer && !customerLoading){
        return <Navigate to="/login" />
    }
    
    return (
        <div className={cn("flex flex-col gap-5 transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Title className="text-2xl md:text-4xl">Cart</Title>
            <Card>
                <div className={cn("flex items-center gap-5 pb-5 border-b border-gray-300", isDark && 'border-gray-500')}>
                    <CustomizedChip label={`${cart.length} items`} />
                </div>
                {!loading && cart.length === 0 && <div className="flex flex-col items-center gap-2 mt-10">
                    <img className="w-[200px] h-[200px]" src={isDark ? "/white-cart.png" : "/cart.png"} />
                    <h1 className={cn("text-center text-4xl font-bold text-gray-800", isDark && 'text-gray-300')}>Your Cart is empty.</h1>
                    <p className={cn("text-center text-lg mb-4 text-gray-600", isDark && 'text-gray-400')}>You have no items in your cart
                        <br />
                        Let's go buy something
                    </p>
                    <RedButton onClick={()=> navigate('/products')}>Continue Shopping</RedButton>
                </div>}
                {cart.map((item) => <CartItemContainer key={item._id} item={item} />)}
                <div className="flex flex-col justify-center lg:flex-row lg:justify-end mt-8 gap-5">
                    <h2 className='font-bold text-lg'>Total: ₱{formatNumber(selectedItem.total)}</h2>
                    <RedButton onClick={proceedToCheckout} disabled={selectedItem.items.length === 0}>Checkout ({selectedItem.items.length} items)</RedButton>
                </div>
            </Card>
        </div>
    )
}

export default Cart