import AuthFormContainer from '@components/AuthFormContainer';
import Form from '@components/form';
import AuthInputField from '@components/form/AuthInputField';
import SubmitBtn from '@components/form/SubmitBtn';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppLink from '@ui/AppLink';
import {FormikHelpers} from 'formik';
import {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {AuthStackParamsList} from 'src/@types/navigation';
import catchAsyncError from 'src/api/catchError';
import client from 'src/api/client';
import {updateNotification} from 'src/store/notification';
import * as yup from 'yup';

interface Props {}

const lostPassword = yup.object().shape({
  email: yup
    .string()
    .trim('Email is missing!')
    .email('Please enter a valid email')
    .required('Email is missing!'),
});

interface ForgotPasswordUserEmail {
  email: string;
}

const LostPassword: FC<Props> = props => {
  const initialValues = {email: ''};
  const navigation = useNavigation<NavigationProp<AuthStackParamsList>>();

  const dispatch = useDispatch();

  const handleSubmit = async (
    values: ForgotPasswordUserEmail,
    actions: FormikHelpers<ForgotPasswordUserEmail>,
  ) => {
    // console.log('Hello!');
    actions.setSubmitting(true);
    try {
      const res = await client.post('/auth/forget-password', {
        ...values,
      });
      const data = res.data;
      console.log(data);
      // navigation.navigate('Verification', {userInfo: data.user});
    } catch (e) {
      const err = catchAsyncError(e);
      dispatch(updateNotification({message: err, type: 'error'}));
      console.log('Lost password error', e);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
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
            <AppLink
              title="Sign In"
              onPress={() => navigation.navigate('SignIn')}
            />
            <AppLink
              title="Sign Up"
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

export default LostPassword;
