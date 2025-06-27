import React from "react";
import { cn } from "../utils/utils";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className = "", children }) => {
  return (
    <div className={cn("p-5 bg-white rounded-lg shadow-md border border-gray-300", className)}>
      {children}
    </div>
  );
};

export default Card;
