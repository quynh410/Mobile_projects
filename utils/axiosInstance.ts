import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Platform } from "react-native";

const getBaseURL = () => {
  const API_BASE_URL = 'http://192.168.51.100:8080/api'
  
  if (Platform.OS === 'web') {
    return API_BASE_URL
  }
    return API_BASE_URL
}

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
})

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        config.headers.Authorization = `Bearer ${parsedToken}`;
      }
      
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    } catch (error) {
      console.error('Error getting token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
      } catch (e) {
        console.error('Error removing token:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance