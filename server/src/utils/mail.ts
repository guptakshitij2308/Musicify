import nodemailer from "nodemailer";
import {
  MAIL_SERVICE,
  MAILTRAP_PASS,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "./variables";

import { generateTemplate } from "#/mail/template";
import path from "path";

const generateMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    // service: MAIL_SERVICE,
    host: MAIL_SERVICE,
    port: 2525,
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  return transporter;
};

interface Profile {
  name: string;
  email: string;
  userId: string;
}

export const sendMail = async (token: string, profile: Profile) => {
  const transport = generateMailTransporter();

  const { name, email, userId } = profile;

  const welcomeMessage = `Hi ${name}, welcome to Musicify! Use the given otp to verify your account.`;

  transport.sendMail({
    to: email,
    subject: "Welcome Message from Musicify",
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Welcome to Musicify",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo", // content id
      },
      {
        filename: "welcom.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}

export const sendForgetPasswordLink = async (options: Options) => {
  const transport = generateMailTransporter();

  const { email, link } = options;

  const message = `We just received a request that you forgot you password. Please use this link to create a new password for your account.`;

  transport.sendMail({
    to: email,
    subject: "Password Reset Link",
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Password Reset from Musicify",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

export const sendResetPasswordSuccessEmail = async (
  name: string,
  email: string
) => {
  const transport = generateMailTransporter();

  const message = `Dear ${name} , we have processed your password reset request. Please sign in with your new password.`;

  transport.sendMail({
    to: email,
    subject: "Successful Reset Password",
    from: VERIFICATION_EMAIL,
    html: generateTemplate({
      title: "Successful Reset Password",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};
