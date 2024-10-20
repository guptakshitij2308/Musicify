/* eslint-disable react-native/no-inline-styles */
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from 'src/store/auth';
import AuthNavigator from './AuthNavigation';
import TabNavigator from './TabNavigatior';
import {getFromAsyncStorage, Keys} from '@utils/asyncStorage';
import client from 'src/api/client';
import Loader from '@ui/Loader';
import {StyleSheet, View} from 'react-native';
import colors from '@utils/colors';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.SECONDARY,
  },
};

const AppNavigator: FC<Props> = props => {
  const {loggedIn, profile, busy} = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          dispatch(updateBusyState(false));
          return;
        }
        // As this is a get req...., hence we are passing the token in authorization in headers
        const {data} = await client.get('/auth/is-auth', {
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log(data);
        dispatch(updateLoggedInState(true));
        dispatch(updateProfile(data.profile));
      } catch (e) {
        console.log('Auth Error : ', e);
      }
      dispatch(updateBusyState(false));
    };
    fetchAuthInfo();
  }, [dispatch]);

  if (busy) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: colors.OVERLAY,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}>
        <Loader />
      </View>
    );
  }

  return (
    <NavigationContainer theme={AppTheme}>
      {!loggedIn ? <AuthNavigator /> : <TabNavigator profile={profile} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
