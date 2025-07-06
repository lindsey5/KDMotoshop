import { createContext, useEffect, useState, type ReactNode } from "react";
import { fetchData } from "../services/api";
import { CircularProgress } from "@mui/material";
import { cn } from "../utils/utils";
import useDarkmode from "../hooks/useDarkmode";

interface User {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  image: {
    public_id: string;
    url: string;
  };
  role: string;
}

// Context type
interface UserContextType {
  user: User | null;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType>({
  user: null,
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const isDark = useDarkmode();

  useEffect(() => {
    const getUser = async () => {
      const response = await fetchData('/api/user');

      if (response.user) setUser(response.user);
      else {
        window.location.href = '/admin/login';
      }
    };

    getUser()
  }, []);

  if(!user) return (
    <div className={cn("h-screen flex justify-center items-center", isDark && 'bg-[#1e1e1e]')}>
      <CircularProgress sx={{ color: 'red'}}/>
    </div>
  )

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
