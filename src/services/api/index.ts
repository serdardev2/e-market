import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
