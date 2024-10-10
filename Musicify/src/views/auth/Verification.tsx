import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppLink from '@ui/AppLink';
import OTPField from '@ui/OTPField';
import colors from '@utils/colors';
import {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {AuthStackParamsList} from 'src/@types/navigation';
import client from 'src/api/client';

type Props = NativeStackScreenProps<AuthStackParamsList, 'Verification'>;

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const [submitting, setSubmitting] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [canSendNewOtp, setCanSendNewOtp] = useState(false);

  // console.log(props.route.params.userInfo, 'Hello!');
  const {userInfo} = props.route.params;

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

  useEffect(() => {
    if (canSendNewOtp) return;
    const intervalId = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 0) {
          setCanSendNewOtp(true);
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // We have to use clearInterval to clear the interval
    return () => clearInterval(intervalId);
  }, [canSendNewOtp]);

  const isValidOtp = otp.every(value => {
    return value.trim();
  });
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();

  const handleSubmit = async () => {
    // console.log('Hello');
    if (!isValidOtp) {
      return;
    }
    setSubmitting(true);
    try {
      const res = await client.post('/auth/verify-email', {
        token: otp.join(''),
        userId: userInfo.id,
      });
      // console.log(res);
      const {data} = res;
      console.log(data);
      navigation.navigate('SignIn');
    } catch (e) {
      console.log('Error in verifying the token', e);
    }
    setSubmitting(false);
  };

  const requestForOTP = async () => {
    // console.log('Hello');
    setCountDown(60);
    setCanSendNewOtp(false);
    try {
      await client.post('/auth/re-verify-email', {userId: userInfo.id});
    } catch (e) {
      console.log('There was an error while requesting for OTP', e);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <AuthFormContainer title="Please look at your email.">
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
        <SubmitBtn
          title="Submit"
          // onPress={handleSubmit}

          busy={submitting}
        />
        <View style={styles.linkContainer}>
          {countDown > 0 && (
            <Text style={styles.countDown}>{countDown} secs</Text>
          )}
          <AppLink
            active={canSendNewOtp}
            title="Resend OTP"
            // onPress={() => setCanSendNewOtp(false)}
            onPress={requestForOTP}
          />
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
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: 20,
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 8,
  },
});

export default Verification;
