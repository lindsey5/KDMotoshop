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
      if (response.success) setCart(response.carts.map((item : any) => {
        if(item.quantity > item.stock) item.quantity = item.stock;
        return {...item, isSelected: true}
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
