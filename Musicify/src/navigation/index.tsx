import {NavigationContainer} from '@react-navigation/native';
import {FC} from 'react';
import {useSelector} from 'react-redux';
import {getAuthState} from 'src/store/auth';
import AuthNavigator from './AuthNavigation';
import TabNavigator from './TabNavigatior';

interface Props {}

const AppNavigator: FC<Props> = props => {
  const {loggedIn, profile} = useSelector(getAuthState);
  //   const authState = useSelector(getAuthState);
  //   console.log(authState);
  //   console.log(loggedIn, profile);
  return (
    <NavigationContainer>
      {!loggedIn ? <AuthNavigator /> : <TabNavigator profile={profile} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
