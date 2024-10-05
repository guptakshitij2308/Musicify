import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import axios from 'axios';
import {FormikHelpers} from 'formik';
import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {AuthStackParamsList} from 'src/@types/navigation';
import client from 'src/api/client';
import * as yup from 'yup';

interface Props {}

interface NewUser {
  name: '';
  email: '';
  password: '';
}

const signUpSchema = yup.object().shape({
  name: yup
    .string()
    .trim('Name is missing!')
    .min(3, 'Name is too short!')
    .required('Name is missing!'),
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Please enter a valid email')
    .required('Email is missing!'),
  password: yup
    .string()
    .trim('Password is missing')
    .min(8, 'Password too short!')
    .matches(/^(?=.*[a-z])/, 'Password Must Contain One Lowercase Character')
    .matches(/^(?=.*[A-Z])/, 'Password Must Contain One Uppercase Character')
    .matches(/^(?=.*[0-9])/, 'Password Must Contain One Number Character')
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      'Password Must Contain  One Special Case Character',
    )
    .required('Password is required'),
});

const handleSubmit = async (
  values: NewUser,
  actions: FormikHelpers<NewUser>,
) => {
  try {
    // const res = await axios.post('http://192.168.69.23:8000/auth/create', {
    //   ...values,
    // });
    const res = await client.post('/auth/create', {
      ...values,
    });
    const data = res.data;
    // console.log(res);
    console.log(data);
  } catch (e) {
    console.log('Sign up error', e);
  }
};

const SignUp: FC<Props> = props => {
  const initialValues = {name: '', email: '', password: ''};
  // const [userInfo, setUserInfo] = useState(initialValues);
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={signUpSchema}>
      <AuthFormContainer
        title="Welcome!"
        subtitle="Let's create your account to get started">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="John Doe"
            containerStyle={styles.marginBottom}
          />

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
          <SubmitBtn title="Sign Up" />
          <View style={styles.linkContainer}>
            <AppLink
              title="Forgot Password"
              onPress={() => navigation.navigate('LostPassword')}
            />
            <AppLink
              title="Sign in"
              onPress={() => navigation.navigate('SignIn')}
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

export default SignUp;
