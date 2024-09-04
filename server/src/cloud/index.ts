import { CLOUD_KEY, CLOUD_NAME, CLOUD_SECRET } from "#/utils/variables";
import { v2 as cloudinary } from "cloudinary";

try {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_KEY,
    api_secret: CLOUD_SECRET,
    secure: true,
  });
  console.log("Cloudinary connected successfully!");
} catch (err) {
  console.log(err);
}

// console.log(cloudinary.config());

export default cloudinary;
