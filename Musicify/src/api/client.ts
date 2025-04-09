import {getFromAsyncStorage, Keys} from '@utils/asyncStorage';
import axios, {CreateAxiosDefaults} from 'axios';

const baseURL = 'http://192.168.69.72:8000';
const client = axios.create({baseURL});
// const client = axios.create({baseURL: 'http://192.168.50.99:8000'});

type headers = CreateAxiosDefaults<any>['headers'];

export const getClient = async (headers?: headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
  if (!token) axios.create({baseURL});
  const defaultHeaders = {Authorization: `Bearer ${token}`, ...headers};
  return axios.create({baseURL, headers: defaultHeaders});
};

export default client;
