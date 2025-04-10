import { AxiosResponse } from "axios";
import API from "../config/apiClient";
// import { Session } from "../types";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  confirmPassword: string;
}

type ResetPassWordData = {
  verificationCode: string;
  password: string;
};

export const login = async (data: LoginData): Promise<AxiosResponse> =>
  API.post("/auth/login", data);

export const logout = async (): Promise<AxiosResponse> =>
  API.get("/auth/logout");

export const register = async (data: RegisterData): Promise<AxiosResponse> =>
  API.post("/auth/register", data);

export const verifyEmail = async (
  verificationCode: string
): Promise<AxiosResponse> => API.get(`/auth/email/verify/${verificationCode}`);

export const sendPasswordResetEmail = async (
  email: string
): Promise<AxiosResponse> => API.post("/auth/password/forgot", { email });

export const resetPassword = async ({
  verificationCode,
  password,
}: ResetPassWordData): Promise<AxiosResponse> =>
  API.post("/auth/password/reset", { verificationCode, password });

export const getUser = async (): Promise<AxiosResponse> => API.get("/user");

export const getSessions = async (): Promise<AxiosResponse> =>
  API.get("/sessions");

export const deleteSession = async (
  sessionId: string
): Promise<AxiosResponse> => API.delete(`/sessions/${sessionId}`);
