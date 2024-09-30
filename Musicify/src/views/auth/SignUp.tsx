import AuthInputField from '@components/AuthInputField';
import colors from '@utils/colors';
import {Formik} from 'formik';
import {FC, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Button} from 'react-native';
import * as yup from 'yup';

interface Props {}

const signUpSchema = yup.object({
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

const SignUp: FC<Props> = props => {
  const initialValues = {name: '', email: '', password: ''};
  const [userInfo, setUserInfo] = useState(initialValues);

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={values => console.log(values)}
        validationSchema={signUpSchema}>
        {({handleSubmit, values, handleChange, errors}) => {
          // {
          //   console.log(errors);
          // }
          return (
            <View style={styles.formContainer}>
              <AuthInputField
                label="Name"
                placeholder="John Doe"
                containerStyle={styles.marginBottom}
                onChange={handleChange('name')}
                value={values.name}
                errorMessage={errors.name}
              />

              <AuthInputField
                label="Email"
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.marginBottom}
                onChange={handleChange('email')}
                value={values.email}
                errorMessage={errors.email}
              />

              <AuthInputField
                label="Password"
                placeholder="********"
                secureTextEntry={true}
                autoCapitalize="none"
                value={values.password}
                onChange={handleChange('password')}
                errorMessage={errors.password}
              />
              <Button title="Sign Up" onPress={handleSubmit} />
            </View>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {color: colors.CONTRAST},
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default SignUp;
