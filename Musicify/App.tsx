import {NavigationContainer} from '@react-navigation/native';
import {FC} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AuthNavigator from 'src/navigation/AuthNavigation';

interface Props {}

const App: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
