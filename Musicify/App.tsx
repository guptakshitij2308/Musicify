import Verification from '@views/auth/Verification';
import {FC} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
// import SignUp from './src/views/auth/SignUp';

interface Props {}

const App: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <SignUp /> */}
      {/* <SignIn /> */}
      {/* <LostPassword /> */}

      <Verification />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
