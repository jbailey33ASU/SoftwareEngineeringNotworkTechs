import axios from "axios";


const API_URL: string = 'http://localhost:8000';

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

export default axiosInstance;