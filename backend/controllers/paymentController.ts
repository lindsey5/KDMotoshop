import { Response, Request } from "express";
import { applyVoucherToItems } from "../utils/voucherUtils";
import Voucher from "../models/Voucher";

const url = process.env.NODE_ENV === 'production' ? process.env.URL : 'http://localhost:5173';

export const createPaymentCheckout = async (req: Request, res: Response) => {
    try {
        const { order, orderItems, cart } = req.body;

        // Apply voucher per item
        const voucher = await Voucher.findById(order.voucher);

        const finalItems = order.voucher && voucher ? await applyVoucherToItems(orderItems, voucher) : orderItems;

        const line_items = finalItems.map((item: any) => (  {
            images: [item.image],
            currency: "PHP",
            amount: Math.round((item.discountedPrice || item.price) * 100),
            name: item.product_name,
            quantity: item.quantity
        }));

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: `Basic ${process.env.PAYMONGO_SECRET}`
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        send_email_receipt: true,
                        show_description: false,
                        show_line_items: true,
                        line_items,
                        success_url: url,
                        cancel_url: url,
                        payment_method_types: ['gcash', 'paymaya', 'card'],
                        metadata: {
                            orderItems: JSON.stringify(finalItems),
                            order: JSON.stringify(order),
                            cart: JSON.stringify(cart)
                        }
                    }
                }
            })
        };

        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
        const result = await response.json();

        if (response.ok) {
            res.status(200).json({ success: true, id: result.data.id, checkout_url: result.data.attributes.checkout_url });
            return;
        }

        res.status(400).json({ success: false, message: result });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};
