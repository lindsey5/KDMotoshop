import nodemailer from 'nodemailer'

export const sendVerificationCode = async (email: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    await transporter.sendMail({
      from: 'KD Motoshop <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: 'Your KD Motoshop Verification Code',
      html: htmlContent,
    });

    return verificationCode;
  } catch (err : any) {
    throw new Error(err.message)
  }
};

export const sendOrderUpdate = async (email: string, order_id : string, firstname : string, status: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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
        `

    await transporter.sendMail({
      from: `KD Motoshop <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'KD Motoshop - Order Update',
      html: htmlContent,
    });

    return true;
  } catch (err: any) {
    console.error('Error sending email:', err.message);
    throw new Error('Failed to send order update email.');
  }
};