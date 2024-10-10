interface NewUserResponse {
  name: string;
  email: string;
  id?: string;
}
export type AuthStackParamsList = {
  SignUp: undefined;
  SignIn: undefined;
  LostPassword: undefined;
  Verification: {userInfo: NewUserResponse};
};
