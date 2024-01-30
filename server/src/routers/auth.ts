import { validate } from "#/middleware/validator";

import { Router } from "express";
import {
  CreateUserSchema,
  TokenAndIDValidation,
} from "#/utils/validationSchema";
import {
  create,
  generateForgetPasswordLink,
  isValidPasswordResetToken,
  sendReVerificationToken,
  verifyEmail,
} from "#/controllers/user";

const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReVerificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-password-reset-token",
  validate(TokenAndIDValidation),
  isValidPasswordResetToken
);

export default router;
