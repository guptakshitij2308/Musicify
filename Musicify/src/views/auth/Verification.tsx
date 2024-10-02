import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import OTPField from '@ui/OTPField';
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

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  const initialValues = {email: ''};
  return (
    <Form
      initialValues={initialValues}
      onSubmit={values => console.log(values)}
      validationSchema={lostPassword}>
      <AuthFormContainer
        title="Forget Password!"
        subtitle="Forgot your password? Don't worry we got you back!">
        <View style={styles.inputContainer}>
          {otpFields.map((_, idx) => {
            return <OTPField key={idx} placeholder="*" />;
          })}
        </View>
        <SubmitBtn title="Submit" />
        <View style={styles.linkContainer}>
          <AppLink title="Resend OTP" />
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default Verification;
