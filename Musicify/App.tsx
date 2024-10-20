/* eslint-disable @typescript-eslint/no-unused-vars */
import AppContainer from '@components/AppContainer';
import {FC, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from 'src/navigation';
import store from './src/store/index';
import {clearAsyncStorage} from '@utils/asyncStorage';
import {QueryClient, QueryClientProvider} from 'react-query';

interface Props {}

const App: FC<Props> = props => {
  // useEffect(() => {
  //   async function init() {
  //     await clearAsyncStorage().then(() => console.log('cleared'));
  //   }
  //   init();
  // }, []);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppContainer>
          <AppNavigator />
        </AppContainer>
      </Provider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
