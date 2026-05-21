import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const BASE_URL = process.env.FINSMART_API_URL ?? 'http://localhost:8000/api/v1';

export const api = axios.create({ baseURL: BASE_URL });

// Attach JWT access token to every request
api.interceptors.request.use(config => {
  const token = storage.getString('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// TODO: Add refresh-token interceptor on 401
