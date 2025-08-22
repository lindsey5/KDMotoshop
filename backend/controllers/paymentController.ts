import { Response, Request } from "express";

const url = process.env.NODE_ENV === 'production' ? process.env.URL : 'http://localhost:5173';

export const createPaymentCheckout = async (req : Request, res: Response) => {
    try{
        const { order, orderItems, cart } = req.body

        const line_items = orderItems.map((item : any) => ({ 
            images: [item.image],
            currency: "PHP", 
            amount: item.price * 100, 
            name: item.product_name,  
            quantity: item.quantity 
        }))

        line_items.push({
            currency: "PHP",
            amount: order.shipping_fee * 100,
            name: "Shipping fee",
            quantity: 1,
        })

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
                        orderItems: JSON.stringify(orderItems),
                        order: JSON.stringify(order),
                        cart: JSON.stringify(cart)
                    }
                }
                }
            })
        };

        const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options)
        if(response.ok){
            const result = await response.json();
            res.status(200).json({success: true, id: result.data.id, checkout_url: result.data.attributes.checkout_url})
        }
        res.status(200).json()
    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message })
    }

}