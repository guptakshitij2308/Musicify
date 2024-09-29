import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, TextInput, SafeAreaView, Text} from 'react-native';

interface Props {}

const SignUp: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="Name"
          style={styles.input}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="Email"
          style={styles.input}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          placeholder="********"
          style={styles.input}
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
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 25,
    color: colors.CONTRAST,
    paddingHorizontal: 10,
  },
  label: {color: colors.CONTRAST},
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default SignUp;
