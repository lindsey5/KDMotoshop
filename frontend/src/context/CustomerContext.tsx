import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { fetchData } from "../services/api";
import { CustomerNotificationContextProvider } from "./CustomerNotifContext";

// Context type
interface CustomerContextType {
  customer: Customer | null;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
}

// Create the context with a default value
export const CustomerContext = createContext<CustomerContextType>({
  customer: null,
  setCustomer: () => {},
});

interface CustomerContextProviderProps {
  children: ReactNode;
}

export const CustomerContextProvider = ({ children }: CustomerContextProviderProps) => {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const getCustomer = async () => {
      const response = await fetchData('/api/customer');

      if (response.customer) setCustomer(response.customer);
    };

    getCustomer()
  }, []);

  return (
    <CustomerNotificationContextProvider>
      <CustomerContext.Provider value={{ customer, setCustomer }}>
        {children}
      </CustomerContext.Provider>
    </CustomerNotificationContextProvider>
  );
};
