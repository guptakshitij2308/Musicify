import AsyncStorage from '@react-native-async-storage/async-storage';

// Using async storage as data of the app should remain to the app only .
export const saveToAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};
export const getFromAsyncStorage = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const clearAsyncStorage = async () => {
  await AsyncStorage.clear();
};

export const enum Keys {
  AUTH_TOKEN = 'AUTH_TOKEN',
}
