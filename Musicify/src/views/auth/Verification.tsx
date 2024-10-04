import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import AppLink from '@ui/AppLink';
import OTPField from '@ui/OTPField';
import {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
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

  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);

  function handleChange(value: string, idx: number) {
    const newOTP = [...otp];
    // moves to prev only if the field is empty
    // console.log(idx);
    if (value === 'Backspace') {
      if (!newOTP[idx]) {
        setActiveOtpIndex(idx - 1);
      }
      newOTP[idx] = '';
    }
    // update otp and move to the next
    else {
      // console.log('here bro');

      newOTP[idx] = value;
      // Only move to the next index if not at the last index
      setActiveOtpIndex(idx + 1);
    }

    setOtp([...newOTP]);
  }

  function handlePaste(value: string) {
    if (value.length === otp.length) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

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
            return (
              <OTPField
                ref={activeOtpIndex === idx ? inputRef : null}
                key={idx}
                placeholder="*"
                // Using onKeyPress instead of onChangeText as using this we can also track backspace key presses and can move in both dirns
                onKeyPress={({nativeEvent}) =>
                  handleChange(nativeEvent.key, idx)
                }
                onChangeText={handlePaste}
                keyboardType="numeric"
                value={otp[idx] || ''}
              />
            );
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
