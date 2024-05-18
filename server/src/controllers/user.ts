import { RequestHandler } from "express";
import { CreateUser, VerifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import { sendForgetPasswordLink, sendMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";
import EmailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import PasswordResetToken from "#/models/passwordResetToken";
import crypto from "crypto";
import { JWT_SECRET_KEY, PASSWORD_RESET_LINK } from "#/utils/variables";
import { sendResetPasswordSuccessEmail } from "./../utils/mail";
import jwt from "jsonwebtoken";
import { RequestWithFiles } from "#/middleware/fileParser";
import cloudinary from "#/cloud";
import formidable from "formidable";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  // Verfication email
  const token = generateToken();

  await EmailVerificationToken.create({
    owner: user._id,
    token,
  });

  sendMail(token, { name, email, userId: user._id.toString() });
  res.status(201).send({ user: { id: user._id, name, email } });
};

export const verifyEmail: RequestHandler = async (
  req: VerifyEmailRequest,
  res
) => {
  const { token, userId } = req.body;

  const verificationToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken) {
    return res.status(403).json({ error: "Invalid token!" });
  }

  const matched = await verificationToken.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await User.findByIdAndUpdate(userId, {
    verified: true,
  });

  await EmailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified." });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Invalid request!" });

  await EmailVerificationToken.findOneAndDelete({ owner: userId });

  const token = generateToken();

  await EmailVerificationToken.create({
    owner: userId,
    token,
  });

  sendMail(token, {
    name: user.name,
    email: user.email,
    userId: user._id.toString(),
  });

  res.json({ message: "Please check your email." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "Account not found!" });

  // generate the link

  // https://yourapp.com/reset-password?token=fdkajs fkdajsf&userId=843590dfjkh

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  const token = crypto.randomBytes(36).toString("hex");

  await PasswordResetToken.create({
    owner: user._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`;

  sendForgetPasswordLink({ email, link: resetLink });
  res.json({ message: "Please check your email for reset password link." });
};

export const grantValid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findById(userId);

  if (!user) return res.status(403).json({ error: "Unauthorized access." });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "The new password must be different!" });

  user.password = password;
  user.save();

  await PasswordResetToken.findOneAndDelete({ owner: user._id });

  await sendResetPasswordSuccessEmail(user.name, user.email);

  res.json({ message: "Password reset successfully!" });
};

export const singIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: "No account found for this email!" });

  const matched = await user.comparePassword(password);
  if (!matched) {
    return res
      .status(403)
      .json({ message: "Email/Password does not matches!" });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY);

  user.tokens.push(token);
  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
      followers: user.followers.length,
      followings: user.followings.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as formidable.File;

  const user = await User.findById(req.user.id);

  if (!user) throw new Error("User not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    // if already an avatar remove it

    if (user.avatar?.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    // else add a new avatar
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avatar = { url: secure_url, publicId: public_id };
    await user.save();
  }

  res.json({ message: "Profile updated successfully!", avatar: user.avatar });
};
