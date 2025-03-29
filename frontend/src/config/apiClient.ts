import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

const options: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const API: AxiosInstance = axios.create(options);

API.interceptors.response.use(
  (response) => response.data, //in case of success we return response.data
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse; //Error response from api
    return Promise.reject({ status, ...data });
  }
);

export default API;
