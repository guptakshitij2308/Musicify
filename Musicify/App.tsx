import {FC} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from 'src/navigation';
import store from './src/store/index';

interface Props {}

const App: FC<Props> = props => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        {/* <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer> */}
        <AppNavigator />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
