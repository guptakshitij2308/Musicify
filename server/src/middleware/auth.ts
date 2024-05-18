import passwordResetToken from "#/models/passwordResetToken";
import { JWT_SECRET_KEY } from "#/utils/variables";
import { RequestHandler, Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/models/user";

export const isValidPasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  const { userId, token } = req.body;

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken) {
    // console.log("reset token");
    return res
      .status(403)
      .json({ error: "Unauthorized access invalid token!" });
  }
  const verified = await resetToken.compareToken(token);

  if (!verified) {
    return res
      .status(403)
      .json({ error: "Unauthorized access invalid token!" });
  }

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Unauthorized access!" });

  const payload = verify(token, JWT_SECRET_KEY) as JwtPayload;

  const id = payload.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
    followers: user.followers.length,
    followings: user.followings.length,
  };

  req.token = token;

  next();
};
