import nodemailer from "nodemailer";
import { MAILTRAP_PASS, MAILTRAP_USER, VERIFICATION_EMAIL } from "./variables";

import EmailVerificationToken from "#/models/emailVerificationToken";

import { generateTemplate } from "#/mail/template";
import path from "path";

const generateMailTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
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

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

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
        cid: "logo",
      },
      {
        filename: "welcom.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};
