import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import colors from '@utils/colors';
import {FC} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import * as yup from 'yup';

interface Props {}

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

const SignUp: FC<Props> = props => {
  const initialValues = {name: '', email: '', password: ''};
  // const [userInfo, setUserInfo] = useState(initialValues);

  return (
    <SafeAreaView style={styles.container}>
      <Form
        initialValues={initialValues}
        onSubmit={values => console.log(values)}
        validationSchema={signUpSchema}>
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="John Doe"
            containerStyle={styles.marginBottom}
            // onTextChange={handleChange('name')}
            // value={values.name}
            // errorMessage={errors.name}
          />

          <AuthInputField
            name="email"
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
            // onTextChange={handleChange('email')}
            // value={values.email}
            // errorMessage={errors.email}
          />

          <AuthInputField
            name="password"
            label="Password"
            placeholder="********"
            secureTextEntry={true}
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
            // value={values.password}
            // onTextChange={handleChange('password')}
            // errorMessage={errors.password}
          />
          {/* <Button title="Sign Up" /> */}
          <SubmitBtn title="Sign Up" />
        </View>
      </Form>
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
