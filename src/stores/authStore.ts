/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { authService } from "@/services/authService";
import { toast } from "react-toastify";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  refreshToken: localStorage.getItem("refresh_token"),
  loading: false,
  isAuthenticated: !!localStorage.getItem("access_token"),

  login: async (username, password) => {
    set({ loading: true });
    try {
      const res = await authService.login({ username, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      set({
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
        loading: false,
        isAuthenticated: true,
      });
      toast.success("Login successful 🎉");
      return true;
    } catch (err: any) {
      set({ loading: false });
      toast.error(err.response?.data?.message || "Invalid credentials");
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const res = await authService.register({ username, email, password });
      if (res.data.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
        set({
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
          loading: false,
          isAuthenticated: true,
        });
        toast.success("Registration successful 🎉");
      } else {
        set({ loading: false });
      }
      return true;
    } catch (err: any) {
      set({ loading: false });
      toast.error(
        err.response?.status === 409
          ? "Username or email already exists"
          : "Registration failed"
      );
      return false;
    }
  },

  forgotPassword: async (email) => {
  set({ loading: true });
  try {
    const res = await authService.forgotPassword({ email });

    if (res && res.status >= 200 && res.status < 300) {
      toast.success("A reset link was sent 💌");
      set({ loading: false });
      return true;
    }

    set({ loading: false });
    toast.error("Failed to send reset link");
    return false;
  } catch (err: any) {
    set({ loading: false });
    toast.error(err.response?.data?.message || "Failed to send reset link");
    return false;
  }
},


  resetPassword: async (token, password) => {
  set({ loading: true });
  try {
    const res = await authService.resetPassword({ token, password });

    if (res && res.status >= 200 && res.status < 300) {
      set({ loading: false });
      toast.success("Password has been reset successfully 🎉");
      return true;
    }

    set({ loading: false });
    toast.error("Password reset failed");
    return false;
  } catch (err: any) {
    set({ loading: false });
    toast.error(err.response?.data?.message || "Password reset failed");
    return false;
  }
},


  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    toast.info("Logged out 👀");
  },
}));
