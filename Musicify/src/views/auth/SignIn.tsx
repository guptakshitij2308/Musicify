import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';

import {FC, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import * as yup from 'yup';

interface Props {}

const signInSchema = yup.object().shape({
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
    .required('Password is required'),
});

const SignIn: FC<Props> = props => {
  const initialValues = {email: '', password: ''};
  // const [userInfo, setUserInfo] = useState(initialValues);
  const [secureEntry, setSecureEntry] = useState(true);
  return (
    <Form
      initialValues={initialValues}
      onSubmit={values => console.log(values)}
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
            <AppLink title="Forgot Password" />
            <AppLink title="Sign up" />
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
