import SignUp from '@views/auth/SignUp';
import {FC} from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';
// import SignUp from './src/views/auth/SignUp';

interface Props {}

const App: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <SignUp />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
