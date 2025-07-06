import React from "react";
import { cn } from "../utils/utils";
import useDarkmode from "../hooks/useDarkmode";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children }) => {
    const isDark = useDarkmode();
    
    return (
        
    <div className={cn("p-5 rounded-lg shadow-md border", className, isDark ? "bg-[#1e1e1e] border-gray-600 text-white" : 'bg-white border-gray-300')}>
      {children}
    </div>
  );
};

export default Card;
