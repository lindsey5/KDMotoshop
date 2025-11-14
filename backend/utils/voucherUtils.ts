
import { IOrderItem } from "../models/OrderItem";
import { IVoucher } from "../models/Voucher";

export const applyVoucherToItems = (items: IOrderItem[], voucher: IVoucher) => {
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