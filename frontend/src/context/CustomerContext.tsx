import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { fetchData } from "../services/api";

// Context type
interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
}

// Create the context with a default value
export const CustomerContext = createContext<CustomerContextType>({
  customer: null,
  loading: true,
  setCustomer: () => {},
});

interface CustomerContextProviderProps {
  children: ReactNode;
}

export const CustomerContextProvider = ({ children }: CustomerContextProviderProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCustomer = async () => {
      setLoading(true)
      const response = await fetchData('/api/customer');

      if (response.customer) setCustomer(response.customer);
      setLoading(false)
    };

    getCustomer()
  }, []);

  return (
      <CustomerContext.Provider value={{ customer, setCustomer, loading }}>
        {children}
      </CustomerContext.Provider>
  );
};
