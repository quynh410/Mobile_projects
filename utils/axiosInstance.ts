import axios from "axios"
import { Platform } from "react-native"

const getBaseURL = () => {
  const API_BASE_URL = 'http://172.20.10.5:8080/api'
  
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

export default axiosInstance