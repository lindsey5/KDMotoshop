import { createContext, useState, type ReactNode, type Dispatch, type SetStateAction, useEffect } from "react";

interface DarkmodeContextValue {
  theme: 'dark' | 'light';
  setTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
}

export const DarkmodeContext = createContext<DarkmodeContextValue | undefined>(undefined);

export const DarkmodeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'light'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <DarkmodeContext.Provider value={{ theme, setTheme }}>
      {children}
    </DarkmodeContext.Provider>
  );
};
