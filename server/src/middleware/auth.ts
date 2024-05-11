import passwordResetToken from "#/models/passwordResetToken";
import { RequestHandler } from "express";

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
