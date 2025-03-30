import API from "../config/apiClient";

type LoginData = {
  email: string;
  password: string;
};

export const login = async (data: LoginData) => API.post("/auth/login", data);
