import { validate } from "#/middleware/validator";

import { Router } from "express";
import {
  CreateUserSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import {
  create,
  generateForgetPasswordLink,
  sendReVerificationToken,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPasswordResetToken } from "#/middleware/auth";
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

export default router;
