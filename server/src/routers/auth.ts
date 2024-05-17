import { validate } from "#/middleware/validator";

import { Router } from "express";
import {
  CreateUserSchema,
  SignInSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import {
  create,
  generateForgetPasswordLink,
  sendReVerificationToken,
  singIn,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPasswordResetToken, mustAuth } from "#/middleware/auth";
import { grantValid } from "./../controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-password-reset-token",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken,
  grantValid
);

router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPasswordResetToken,
  updatePassword
);

router.post("/sign-in", validate(SignInSchema), singIn);

router.get("/is-auth", mustAuth, (req, res) => {
  res.json({ profile: req.user });
});

router.get("/public", (req, res) => {
  res.json({ message: "You are in public route." });
});
router.get("/private", mustAuth, (req, res) => {
  res.json({ message: "You are in private route." });
});

export default router;
