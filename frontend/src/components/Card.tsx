import React from "react";
import { cn } from "../utils/utils";
import useDarkmode from "../hooks/useDarkmode";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

const Card  = ({ className = "", children } : CardProps) => {
    const isDark = useDarkmode();
    
    return (
        
    <div className={cn("p-5 rounded-lg shadow-lg border", isDark ? "bg-[#2A2A2A] border-gray-500 text-white" : 'bg-white border-gray-300', className)}>
      {children}
    </div>
  );
};

export default Card;
