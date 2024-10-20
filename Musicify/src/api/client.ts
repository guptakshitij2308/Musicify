import axios from 'axios';

const client = axios.create({baseURL: 'http://192.168.69.113:8000'});
// const client = axios.create({baseURL: 'http://192.168.50.99:8000'});

export default client;
