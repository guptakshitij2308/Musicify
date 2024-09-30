import AuthInputField from '@components/AuthInputField';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Button} from 'react-native';

interface Props {}

const SignUp: FC<Props> = props => {
  const [userInfo, setUserInfo] = useState({name: '', email: '', password: ''});
  const [errorInfo, setErrorInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {/* <Text style={styles.label}>Name</Text>
        <AppInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="Name"
        /> */}
        <AuthInputField
          label="Name"
          placeholder="John Doe"
          containerStyle={styles.marginBottom}
          onChange={text => setUserInfo({...userInfo, name: text})}
          errorMessage={errorInfo.name}
        />
        {/* <Text style={styles.label}>Email</Text>
        <AppInput
        placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="Email"
          autoCapitalize="none"
        /> */}
        <AuthInputField
          label="Email"
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.marginBottom}
          onChange={text => setUserInfo({...userInfo, email: text})}
          errorMessage={errorInfo.email}
        />
        {/* <Text style={styles.label}>Password</Text>
        <AppInput
        placeholderTextColor={colors.INACTIVE_CONTRAST}
        placeholder="********"
          secureTextEntry={true}
          /> */}
        <AuthInputField
          label="Password"
          placeholder="********"
          secureTextEntry={true}
          autoCapitalize="none"
          onChange={text => setUserInfo({...userInfo, password: text})}
          errorMessage={errorInfo.password}
        />
        <Button
          title="Sign Up"
          onPress={() => {
            if (!userInfo.name) {
              return setErrorInfo({
                email: '',
                password: '',
                name: 'Name is required',
              });
            }
            if (!userInfo.email) {
              return setErrorInfo({
                name: '',
                password: '',
                email: 'Email is required',
              });
            }
            if (!userInfo.password) {
              return setErrorInfo({
                name: '',
                email: '',
                password: 'Password is required',
              });
            }
            setErrorInfo({...errorInfo, name: '', email: '', password: ''});
            console.log(userInfo);
          }}
        />
      </View>
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
