import nodemailer from 'nodemailer'

export const sendVerificationCode = async (email : string) => {
    try{
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      await transporter.sendMail({
          from: "KD Motoshop",
          to: `${email}`,
          subject: "KD Motoshop Verification Code",
          text: `Your Verification Code is ${verificationCode}`,
      });

      return verificationCode;
    }catch(err){
      console.log(err)
      return null
    }
}