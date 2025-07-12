import { useContext, useMemo, useState } from "react"
import { CartContext } from "../../../context/CartContext";
import BreadCrumbs from "../../../components/BreadCrumbs";
import Card from "../../../components/Card";
import { CustomizedChip } from "../../../components/Chip";
import useDarkmode from "../../../hooks/useDarkmode";
import { cn, formatNumber } from "../../../utils/utils";
import CartItemContainer from "../../../components/containers/customer/CartItem";
import { deleteData } from "../../../services/api";
import { confirmDialog, successAlert } from "../../../utils/swal";
import { RedButton } from "../../../components/Button";
import { useNavigate } from "react-router-dom";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' }
]

const Cart = () => {
    const { cart, setCart, loading } = useContext(CartContext);
    const isDark = useDarkmode();
    const navigate = useNavigate();

    const deleteCartItem = async (id : string) => {
        if(await confirmDialog('Remove this item?', '', isDark)){
            const response = await deleteData(`/api/cart/${id}`);

            if(response.success){ 
                successAlert('Item successfully removed', '', isDark)
                setCart(prev => prev.filter(item => item._id !== id))
            }
        }
    }

    const selectedItem = useMemo(() => {
        const items = cart.filter(item => item.isSelected)
        const total = items.reduce((total, item) => total + (item.price * item.quantity), 0)
        return { total, items }
    }, [cart])

    const proceedToCheckout = () => {
        const items = selectedItem.items.map(item => ({ product_id: item.product_id, variant_id: item.variant_id, quantity: item.quantity}))
        localStorage.setItem('items', JSON.stringify(items))
        localStorage.setItem('cart', JSON.stringify(cart))
        navigate('/checkout')
    }
    
    return (
        <div className={cn("flex flex-col gap-5 transition-colors duration-600 pt-30 pb-5 px-5 lg:pb-10 lg:px-10 bg-gray-100", isDark && 'bg-[#121212]')}>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <h1 className="text-3xl font-bold text-red-500">Cart</h1>
            <Card>
                <div className={cn("flex items-center gap-5 pb-5 border-b border-gray-300", isDark && 'border-gray-500')}>
                    <CustomizedChip label={`${cart.length} items`} />
                </div>
                {!loading && cart.length === 0 && <div className="flex flex-col items-center gap-2 mt-10">
                    <img className="w-[200px] h-[200px]" src={isDark ? "/white-cart.png" : "/cart.png"} />
                    <h1 className="text-center text-4xl font-bold">Your Cart is empty.</h1>
                    <p className="text-center text-lg mb-4">You have no items in your cart
                        <br />
                        Let's go buy something
                    </p>
                    <RedButton onClick={()=> navigate('/products')}>Continue Shopping</RedButton>
                </div>}
                {cart.map((item) => <CartItemContainer key={item._id} item={item} remove={deleteCartItem} />)}
                <div className="flex justify-center lg:justify-end mt-8 gap-5 items-center">
                    <h2 className='font-bold text-lg'>Total: ₱{formatNumber(selectedItem.total)}</h2>
                    <RedButton onClick={proceedToCheckout} disabled={selectedItem.items.length === 0}>Checkout ({selectedItem.items.length} items)</RedButton>
                </div>
            </Card>
        </div>
    )
}

export default Cart