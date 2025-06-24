import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(number : number){
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function normalizeCityName(name: string): string {
  // Check if it starts with "City of "
  if (name.startsWith("City of ")) {
    // Remove "City of " and add " City" at the end
    const city = name.replace("City of ", "");
    return `${city} City`;
  }
  // Otherwise, return as-is
  return name;
}