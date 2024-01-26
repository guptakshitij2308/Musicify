import * as yup from "yup";

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
