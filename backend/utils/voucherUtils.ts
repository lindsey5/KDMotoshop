
import { IOrderItem } from "../models/OrderItem";
import { IVoucher } from "../models/Voucher";

export const applyVoucherToItems = (items: IOrderItem[], voucher: IVoucher) => {
    const totalLine = items.reduce((sum, i) => sum + i.lineTotal, 0);
    let totalDiscount = 0;

    return items.map(item => {
        let discountedPrice = item.price;
        let itemDiscount = 0;

        if (voucher.voucherType === "percentage") {
        itemDiscount = item.price * (voucher.percentage ?? 0) / 100;
        discountedPrice = item.price - itemDiscount;
        } else if (voucher.voucherType === "amount") {
        // Distribute fixed amount discount proportionally by line total
        const proportion = item.lineTotal / totalLine;
        itemDiscount = (voucher.amount ?? 0) * proportion / item.quantity;
        discountedPrice = item.price - itemDiscount;
        }

        // Apply maxDiscount if specified
        if (voucher.maxDiscount && (totalDiscount + itemDiscount * item.quantity) > voucher.maxDiscount) {
        const remainingDiscount = voucher.maxDiscount - totalDiscount;
        itemDiscount = remainingDiscount / item.quantity;
        discountedPrice = item.price - itemDiscount;
        }

        totalDiscount += itemDiscount * item.quantity;

        return {
        ...item,
        lineTotal: discountedPrice * item.quantity,
        discountedPrice,
        };
    });
};