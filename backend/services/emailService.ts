import { brevo, sender } from "../utils/brevo";

export const sendVerificationCode = async (email: string) => {
  try {
    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">KD Motoshop Verification</h2>
        <p>Thank you for registering with <strong>KD Motoshop</strong>.</p>
        <p style="margin-bottom: 20px;">Please use the following verification code:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; color: #000;">
          ${verificationCode}
        </div>
        <p style="margin-top: 20px;">This code is valid for a limited time. If you did not request this code, please ignore this email.</p>
        <p style="color: #999; font-size: 12px;">© ${new Date().getFullYear()} KD Motoshop. All rights reserved.</p>
      </div>
    `;

    await brevo.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: 'Your KD Motoshop Verification Code',
      htmlContent,
    });

    return verificationCode;
  } catch (err: any) {
    console.error('Error sending verification email:', err.message);
    throw new Error('Failed to send verification email.');
  }
};

export const sendOrderUpdate = async (
  email: string,
  order_id: string,
  firstname: string,
  status: string
) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #222;">KD Motoshop Order Update</h2>
        </div>
        <p style="font-size: 16px; color: #333;">Hi <strong>${firstname || 'Customer'}</strong>,</p>
        <p style="font-size: 16px; color: #333;">
          We're writing to let you know that your order <strong>${order_id}</strong> has been updated.
        </p>
        <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0; border-left: 4px solid #007bff;">
          <p style="font-size: 18px; margin: 0; color: #007bff;"><strong>Status:</strong> ${status}</p>
        </div>
        <p style="font-size: 16px; color: #333;">
          If you have any questions or concerns, feel free to reach out to our support team.
        </p>
        <p style="font-size: 16px; color: #333;">Thank you for choosing KD Motoshop!</p>
        <hr style="margin: 30px 0;">
        <p style="text-align: center; color: #aaa; font-size: 12px;">
          © ${new Date().getFullYear()} KD Motoshop. All rights reserved.
        </p>
      </div>
    `;

    const response = await brevo.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: 'KD Motoshop - Order Update',
      htmlContent,
    });

    console.log(response)

    return true;
  } catch (err: any) {
    console.error('Error sending order update email:', err.message);
    throw new Error('Failed to send order update email.');
  }
};


interface RefundUpdateProps {
  email: string;
  order_id: string;
  firstname: string;
  status: string;
  product_name: string;
  quantity: number;
  product_image: string;
}

export const sendRefundUpdate = async ({
  email,
  order_id,
  firstname,
  status,
  product_name,
  quantity,
  product_image,
}: RefundUpdateProps) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hi ${firstname},</h2>
        <p>Your refund request for the following item has been updated:</p>
        <div style="border:1px solid #ddd; padding:10px; margin:15px 0;">
          <img src="${product_image}" alt="${product_name}" width="100" style="margin-bottom:10px;" />
          <p><strong>Product:</strong> ${product_name}</p>
          <p><strong>Quantity:</strong> ${quantity}</p>
          <p><strong>Status:</strong> 
            <span style="color:${status === 'Rejected' ? 'red' : status === 'Approved' ? 'green' : 'blue'};">
              ${status}
            </span>
          </p>
        </div>
        <p>Order ID: <strong>${order_id}</strong></p>
        <p style="font-size: 16px; color: #333;">
          If you have any questions or concerns, feel free to reach out to our support team.
        </p>
        <p style="font-size: 16px; color: #333;">Thank you for choosing KD Motoshop!</p>
        <hr style="margin: 30px 0;">
        <p style="text-align: center; color: #aaa; font-size: 12px;">
          © ${new Date().getFullYear()} KD Motoshop. All rights reserved.
        </p>
      </div>
    `;

    await brevo.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: `KD Motoshop Refund Update - Order #${order_id}`,
      htmlContent,
    });

    return true;
  } catch (err: any) {
    console.error('Error sending refund update email:', err.message);
    throw new Error('Failed to send refund update email.');
  }
};

export const sendResetEmail = async (email : string, resetToken : string) => {
  try{
    const url = process.env.NODE_ENV === 'production' ? 'https://kdmotoshop.onrender.com' : 'http://localhost:5173';
    const resetLink = `${url}/reset-password/${resetToken}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <h2 style="text-align: center; color: #333;">KD Motoshop Password Reset Request</h2>
        <p style="font-size: 15px; color: #555;">
          Hello, <br><br>
          You recently requested to reset your password for your account. Click the button below to reset it:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="${resetLink}" 
            target="_blank" 
            style="background-color: #4F46E5; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset My Password
          </a>
        </div>

        <p style="font-size: 14px; color: #555; text-align: center;">
          Or copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; font-size: 13px; text-align: center; color: #4F46E5;">
          ${resetLink}
        </p>

        <p style="font-size: 13px; color: #999; text-align: center; margin-top: 25px;">
          This link will expire in <strong>10 minutes</strong>.<br>
          If you didn’t request a password reset, please ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #aaa;">
          © ${new Date().getFullYear()} KD Motoshop. All rights reserved.
        </p>
      </div>
    `

    await brevo.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: `KD Motoshop Password Reset Request`,
      htmlContent,
    });

    return true;

  } catch (err: any) {
    console.error('Error sending refund update email:', err.message);
    throw new Error('Failed to send refund update email.');
  }
}