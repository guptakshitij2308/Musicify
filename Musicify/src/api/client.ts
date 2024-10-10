import axios from 'axios';

const client = axios.create({baseURL: 'http://192.168.68.203:8000'});

export default client;
