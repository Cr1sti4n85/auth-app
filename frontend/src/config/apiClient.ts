import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";
import queryClient from "./queryClient";
import { navigate } from "../lib/navigation";

const options: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

//creation of new axios instance in order to avoid loops
const TokenRefreshClient: AxiosInstance = axios.create(options);
TokenRefreshClient.interceptors.response.use((response) => response.data);

const API: AxiosInstance = axios.create(options);

API.interceptors.response.use(
  (response) => response.data, //in case of success we return response.data
  async (error: AxiosError) => {
    const { config, response } = error;
    const { data, status } = response as AxiosResponse; //Error response from api

    //try to refresh access token
    if (status === 401 && data?.errorCode === "InvalidAccessToken") {
      try {
        await TokenRefreshClient.get("/auth/refresh");
        if (config) {
          return TokenRefreshClient(config);
        }
      } catch (err) {
        console.log(err);
        queryClient.clear();
        navigate("/login", {
          state: { redirectUrl: window.location.pathname },
        });
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default API;
