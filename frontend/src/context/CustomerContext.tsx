import { createContext, useEffect, useState, type ReactNode } from "react";
import { fetchData } from "../services/api";

interface Customer {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: UploadedImage;
  addresses?: {
    street: string;
    barangay: string;
    city: string;
    region: string;
    firstname: string;
    lastname: string;
    phone: string;
  }[]
}

// Context type
interface CustomerContextType {
  customer: Customer | null;
}

// Create the context with a default value
export const CustomerContext = createContext<CustomerContextType>({
  customer: null,
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
    <CustomerContext.Provider value={{ customer }}>
      {children}
    </CustomerContext.Provider>
  );
};
