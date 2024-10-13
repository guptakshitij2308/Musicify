import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Home from '@views/auth/Home';
import Profile from '@views/auth/Profile';
import Upload from '@views/auth/Upload';

const Tab = createMaterialBottomTabNavigator();

const TabNavigator = ({profile}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={Home} />
      <Tab.Screen name="ProfileScreen" component={Profile} />
      <Tab.Screen name="UploadScreen" component={Upload} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
