import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_SMTP_USER,
    pass: process.env.NEXT_PUBLIC_SMTP__PASS,
  },
});

async function sendMail(
  to: string,
  subject: string,
  text: string,
  html: string
) {
  const info = await transporter.sendMail({
    from: '"Master Authentication ⚡" <authorisedaman@gmail.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
}

export default sendMail;
