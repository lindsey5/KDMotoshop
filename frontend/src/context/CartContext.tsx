import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { fetchData } from "../services/api";

// Context type
interface CartContextType {
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  loading: boolean;
}

// Create the context with a default value
export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  loading: true,
});

interface CartContextProviderProps {
  children: ReactNode;
}

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCart = async () => {
      setLoading(true)
      const response = await fetchData('/api/cart');
      console.log(response.carts)
      if (response.success) setCart(response.carts.map((item : any) => {
        const product = item.product_id
        const variant = product.variants.find((v : any) => v._id === item.variant_id)
        return {
          ...item,
          quantity: item.quantity, 
          attributes: variant.attributes,
          stock: product.product_type === 'Single' ? product.stock : variant.stock,
          product_name: product.product_name,
          price: product.product_type === 'Single' ? product.price : variant.price,
          image: typeof product?.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                ? product.thumbnail.imageUrl
                    : typeof product?.thumbnail === 'string'
                    ? product.thumbnail
                : '/photo.png'
        }
      }));
      setLoading(false)
    };

    getCart()
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};
