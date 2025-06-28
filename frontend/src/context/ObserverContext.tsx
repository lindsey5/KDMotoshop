import { createContext, useEffect, useRef, type ReactNode } from "react";

interface ObserverContextValue {
  elementsRef: React.RefObject<Array<HTMLElement | null>>;
}

// Create the context with a default value of an empty object (undefined)
export const ObserverContext = createContext<ObserverContextValue | undefined>(undefined);

export const ObserverContextProvider = ({ children }: {children: ReactNode}) => {
    const elementsRef = useRef<Array<HTMLElement | null>>([]);
  
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          } else {
            entry.target.classList.remove("animate");
          }
        });
      }, { threshold: 0.5 });
  
      elementsRef.current.forEach((el) => {
        if (el) observer.observe(el);
      });
  
      return () => observer.disconnect();
    }, []);
  
    return (
      <ObserverContext.Provider value={{ elementsRef }}>
        {children}
      </ObserverContext.Provider>
    );
  };
  