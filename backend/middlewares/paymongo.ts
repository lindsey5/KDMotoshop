import { Request, Response } from "express";
import crypto from 'crypto'
import { createNewOrder, generateOrderId } from "../services/orderService";
import Payment from "../models/Payment";
import { successCheckout } from "./socket";

export const paymongoWebhook = async (req : Request, res : Response) => {
  const payload = req.body;
  const signature = req.headers['paymongo-signature'];

    // Verify the webhook signature
    const isValid = verifyWebhookSignature(payload, signature);

    if (isValid && payload.data.attributes.type === 'checkout_session.payment.paid') {
        const { order, orderItems, cart } = payload.data.attributes.data.attributes.metadata
        const parsedOrder = JSON.parse(order)
        const parsedCart = JSON.parse(cart ?? "")
        
        const payment_method = parsedOrder.payment_method === 'ONLINE PAYMENT' ? 
            payload.data.attributes.data.attributes.payment_method_used.toUpperCase() : parsedOrder.payment_method
        const orderData = { ...parsedOrder, payment_method, order_id: await generateOrderId() }
        const createdOrder = await createNewOrder({ orderItems: JSON.parse(orderItems), order: orderData, cart: Array.isArray(parsedCart) ? parsedCart : [] });
        
        if(!createdOrder){
          res.status(400)
          return;
        }
        const payment_id = payload.data.attributes.data.attributes.payments[0].id;
        const order_id = createdOrder._id;
        const newPayment = new Payment({ payment_id, order_id})
        await newPayment.save();

        successCheckout(createdOrder.customer.customer_id.toString());
    }
    
    res.sendStatus(200)
}

function verifyWebhookSignature(payload : any, signature : any) {
  const webhookSecret = process.env.WEBHOOK_SECRET_KEY || '';
  if (!signature) {
    console.error('Missing Paymongo-Signature header');
    return false;
  }

  const components = signature.split(',');
  const timestamp = components[0].split('=')[1];
  const testSignature = components[1].split('=')[1];

  const signedPayload = `${timestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedSignatureBuffer = Buffer.from(testSignature, 'hex');

  return crypto.timingSafeEqual(expectedSignatureBuffer, receivedSignatureBuffer);
}