import { CLOUD_KEY, CLOUD_NAME, CLOULD_SECRET } from "#/utils/variables";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_KEY,
  api_secret: CLOULD_SECRET,
  secure: true,
});

export default cloudinary;
