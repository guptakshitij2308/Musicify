const { env } = process as { env: { [key: string]: string } };

export const {
  MONGO_URI,
  MAILTRAP_USER,
  MAILTRAP_PASS,
  VERIFICATION_EMAIL,
  PASSWORD_RESET_LINK,
  SIGN_IN_URL,
  MAIL_SERVICE,
  JWT_SECRET_KEY,
  CLOUD_NAME,
  CLOUD_KEY,
  CLOUD_SECRET,
} = env;
