import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { categories } from "./audio_category";

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
    .matches(/^(?=.*[a-z])/, "Password Must Contain One Lowercase Character")
    .matches(/^(?=.*[A-Z])/, "Password Must Contain One Uppercase Character")
    .matches(/^(?=.*[0-9])/, "Password Must Contain One Number Character")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Password Must Contain  One Special Case Character"
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

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;

      return "";
    })
    .required("Invalid userId!"),
  password: yup
    .string()
    .trim()
    .required("Password is a required field!")
    .min(8, "Password too short!")
    .matches(/^(?=.*[a-z])/, "Password Must Contain One Lowercase Character")
    .matches(/^(?=.*[A-Z])/, "Password Must Contain One Uppercase Character")
    .matches(/^(?=.*[0-9])/, "Password Must Contain One Number Character")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Password Must Contain  One Special Case Character"
    ),
});

export const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email is a required field!")
    .email("Please enter a valid email address."),
  password: yup.string().trim().required("Password is a required field!"),
});

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().trim().required("Title is a required field!"),
  about: yup.string().trim().required("About is a required field!"),
  category: yup
    .string()
    .oneOf(categories, "Invalid Category!")
    .required("Category is a required field!"),
});

// User can create an empty playlist as well as add audio items to a playlist ; hence resouce id is optional

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().trim().required("Title is a required field!"),
  resId: yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) return value;
    else return "";
  }), // items: []
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().trim().required("Title is a required field!"),
  // for audio id
  item: yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) return value;
    else return "";
  }),
  // for playlist id
  id: yup.string().transform(function (value) {
    if (this.isType(value) && isValidObjectId(value)) return value;
    else return "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!"),
});

export const HistoryUpdateSchema = yup.object().shape({
  audio: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) return value;
      else return "";
    })
    .required("Audio is a required field!"),
  progress: yup.number().required("History progress is required!"),
  date: yup
    .string()
    .transform(function (value) {
      const date = new Date(value);
      if (date instanceof Date) return value;
      else return "";
    })
    .required("Date is a required field!"),
});
