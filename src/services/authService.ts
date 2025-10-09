// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";

export const authService = {
  login: (data: { username: string; password: string }) =>
    api.post("/login", data),

  register: (data: { username: string; email: string; password: string }) =>
    api.post("/register", data),

  forgotPassword: (data: { email: string }) =>
    api.post("/user/forgot-password", data),

  resetPassword: (data: { token: string; password: string }) =>
    api.post("/user/reset-password", data),

  logout: () => api.post("/logout"),
};
