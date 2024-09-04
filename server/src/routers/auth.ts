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
  logOut,
  sendProfile,
  sendReVerificationToken,
  singIn,
  updatePassword,
  updateProfile,
  verifyEmail,
} from "#/controllers/auth";
import { isValidPasswordResetToken, mustAuth } from "#/middleware/auth";
import { grantValid } from "../controllers/auth";
import fileParser from "#/middleware/fileParser";

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

router.get("/is-auth", mustAuth, sendProfile);

router.get("/public", (req, res) => {
  res.json({ message: "You are in public route." });
});
router.get("/private", mustAuth, (req, res) => {
  res.json({ message: "You are in private route." });
});

// router.post("/update-profile", async (req, res) => {
//   // console.log(req.headers);

//   const dir = path.join(__dirname, "../public/profiles");

//   try {
//     await fs.readdirSync(dir);
//   } catch (err) {
//     await fs.mkdirSync(dir);
//   }

//   const form = formidable({
//     uploadDir: dir,
//     filename(name, ext, part, form) {
//       return Date.now() + "_" + part.originalFilename;
//     },
//   }); // returns an object
//   form.parse(req, (err, fields, files) => {
//     // console.log(fields, files); // whenever files are to be dealt...conent type is multipart/form-data in headers
//     res.json({ uploaded: true, message: "Profile updated successfully!" });
//   });
// });
router.post("/update-profile", mustAuth, fileParser, updateProfile);

router.post("/log-out", mustAuth, logOut);

export default router;
