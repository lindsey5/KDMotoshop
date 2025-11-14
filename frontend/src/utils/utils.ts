import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStrongPassword(password : string) : boolean {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongRegex.test(password);
};

export function formatNumberToPeso(number : number){
  return `₱${number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

export function maskMiddle(str : string) : string{
  if (str.length <= 2) return str;
  const firstChar = str[0];
  const lastChar = str[str.length - 1];
  const middleMask = '*'.repeat(str.length - 2);
  return firstChar + middleMask + lastChar;
}

export const exportData = ({ dataToExport, filename, sheetname } : { dataToExport : any[], filename: string, sheetname: string}) => {
  // Convert to worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetname);

  XLSX.writeFile(workbook, filename);
}

export const applyVoucherToItems = (items: OrderItem[], voucher: Voucher) => {
  return items.map(item => {
    let discountedPrice = item.price;

    if (voucher.voucherType === "percentage") {
      discountedPrice = item.price * (1 - (voucher.percentage ?? 0) / 100);
    } else if (voucher.voucherType === "amount") {
      // Distribute fixed amount discount proportionally by line total
      const totalLine = items.reduce((sum, i) => sum + i.lineTotal, 0);
      const proportion = item.lineTotal / totalLine;
      discountedPrice = item.price - (voucher.amount ?? 0) * proportion / item.quantity;
    }

    return {
      ...item,
      lineTotal: discountedPrice * item.quantity,
      discountedPrice,
    };
  });
};