import mongoose from "mongoose";
import { MONGO_URI } from "src/utils/variables";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connection established successfully.");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });
