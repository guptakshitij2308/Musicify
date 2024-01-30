import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { TokenAndIDValidation } from "./validationSchema";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is a required field!")
    .min(3, "Name too short!")
    .max(20, "Name too long!"),
  email: yup
    .string()
    .required("Email is a required field!")
    .email("Invalid email address!"),
  password: yup
    .string()
    .trim()
    .required("Password is a required field!")
    .min(8, "Password too short!")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^])[A-Za-z\d@$!%*#?&^]{8,}$/,
      "Password too simple!"
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;

      return "";
    })
    .required("Invalid userId!"),
});
