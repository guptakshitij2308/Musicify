import { RequestHandler } from "express";
import { CreateUser } from "#/@types/user";
import User from "#/models/user";
import { sendMail } from "#/utils/mail";
import { generateToken } from "#/utils/helper";

export const create: RequestHandler = async (req: CreateUser, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  // Verfication email
  const token = generateToken();
  sendMail(token, { name, email, userId: user._id.toString() });
  res.status(201).send({ user: { id: user._id, name, email } });
};
