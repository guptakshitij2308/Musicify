import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import * as yup from 'yup';

interface Props {}

const lostPassword = yup.object().shape({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Please enter a valid email')
    .required('Email is missing!'),
});

const LostPassword: FC<Props> = props => {
  const initialValues = {email: ''};
  return (
    <Form
      initialValues={initialValues}
      onSubmit={values => console.log(values)}
      validationSchema={lostPassword}>
      <AuthFormContainer
        title="Forget Password!"
        subtitle="Forgot your password? Don't worry we got you back!">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />

          <SubmitBtn title="Send link" />
          <View style={styles.linkContainer}>
            <AppLink title="Sign In" />
            <AppLink title="Sign Up" />
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

export default LostPassword;
