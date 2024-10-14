import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import {Keys, saveToAsyncStorage} from '@utils/asyncStorage';
import {FormikHelpers} from 'formik';

import {FC, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthStackParamsList} from 'src/@types/navigation';
import client from 'src/api/client';
import {updateLoggedInState, updateProfile} from 'src/store/auth';
import * as yup from 'yup';

interface Props {}

const signInSchema = yup.object().shape({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Please enter a valid email')
    .required('Email is missing!'),
  password: yup
    .string()
    .trim('Password is missing')
    .min(8, 'Password too short!')
    .required('Password is required'),
});

interface SignInUserInfo {
  email: string;
  password: string;
}

const SignIn: FC<Props> = props => {
  const initialValues = {email: '', password: ''};
  // const [userInfo, setUserInfo] = useState(initialValues);
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();
  const dispatch = useDispatch();

  const handleSubmit = async (
    values: SignInUserInfo,
    actions: FormikHelpers<SignInUserInfo>,
  ) => {
    // console.log('Hello!');
    actions.setSubmitting(true);
    try {
      const res = await client.post('/auth/sign-in', {
        ...values,
      });
      // console.log(res);
      const data = res.data;
      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);
      dispatch(updateLoggedInState(true));
      dispatch(updateProfile(data.profile));
      // console.log(data);
      // navigation.navigate('Verification', {userInfo: data.user});
    } catch (e) {
      console.log('Sign up error', e);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      initialValues={initialValues}
      // onSubmit={handleSubmit}
      onSubmit={(values, actions) => {
        // console.log('Form submitted with values:', values);
        handleSubmit(values, actions);
      }}
      validationSchema={signInSchema}>
      <AuthFormContainer
        title="Welcome Back!"
        // subtitle="Let's create your account to get started"
      >
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />

          <AuthInputField
            name="password"
            label="Password"
            placeholder="********"
            secureTextEntry={secureEntry}
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={() => setSecureEntry(!secureEntry)}
          />
          {/* <Button title="Sign Up" /> */}
          <SubmitBtn title="Sign In" />
          <View style={styles.linkContainer}>
            <AppLink
              title="Forgot Password"
              onPress={() =>
                // props.navigation.navigate('LostPassword')
                navigation.navigate('LostPassword')
              }
            />
            <AppLink
              title="Sign up"
              onPress={() => navigation.navigate('SignUp')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default SignIn;
