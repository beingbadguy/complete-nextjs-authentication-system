import sendMail from "./mailer";

export const sendEmailVerificationMail = async (
  email: string,
  verificationToken: string
) => {
  const template = `Your Master Authentication verification token  : ${verificationToken}`;
  sendMail(email, "Master Authentication ⚡", ``, template);
};

export const userVerifiedMail = async (email: string) => {
  const template = "Your email has been verified!";
  sendMail(email, "Master Authentication ⚡", ``, template);
};

export const forgetPasswordMail = async (email: string, token: string) => {
  const resetLink = `https://complete-nextjs-authentication-system.vercel.app/reset/${token}`;
  console.log("I just send a mail");

  const template = `Click here to reset your password: ${resetLink}`;
  sendMail(email, "Master Authentication ⚡", "", template);
};

export const passwordResetSuccessMail = async (email: string) => {
  const template = "Your password has been reset successfully!";
  sendMail(email, "Master Authentication ⚡", "", template);
};
