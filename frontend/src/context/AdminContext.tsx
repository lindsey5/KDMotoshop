import { createContext, useEffect, useState, type ReactNode } from "react";
import { fetchData } from "../services/api";
import { CircularProgress } from "@mui/material";
import { cn } from "../utils/utils";
import useDarkmode from "../hooks/useDarkmode";

// Context type
interface AdminContextType {
  admin: Admin | null;
}

// Create the context with a default value
export const AdminContext = createContext<AdminContextType>({
  admin: null,
});

interface AdminContextProviderProps {
  children: ReactNode;
}

export const AdminContextProvider = ({ children }: AdminContextProviderProps) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const isDark = useDarkmode();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchData('/api/admin');
      console.log(response)
      if (response.success) setAdmin(response.admin);
      else {
        window.location.href = '/admin/login';
      }
    };

    getUser()
  }, []);

  if(!admin) return (
    <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
      <CircularProgress sx={{ color: 'red'}}/>
    </div>
  )

  return (
    <AdminContext.Provider value={{ admin }}>
      {children}
    </AdminContext.Provider>
  );
};
