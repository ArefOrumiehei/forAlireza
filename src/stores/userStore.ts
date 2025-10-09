/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { userService } from "@/services/userService";

type DecodedToken = {
  sub: string;
  is_admin?: boolean;
  exp?: number;
  iat?: number;
  [key: string]: any;
};

type UserData = {
  id: string;
  username?: string;
  email?: string;
  [key: string]: any;
};

type UserState = {
  userId: string | null;
  decodedData: DecodedToken | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  setUserFromToken: (token: string) => Promise<void>;
  clearUser: () => void;
  getUserData: (userId: number) => Promise<UserData | null>;
};

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  decodedData: null,
  userData: null,
  isAuthenticated: false,

  setUserFromToken: async (token) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const userId = Number(decoded.sub);

      localStorage.setItem("access_token", token);

      set({
        userId: decoded.sub,
        decodedData: decoded,
        isAuthenticated: true,
      });

      const userData = await get().getUserData(userId);

      if (userData) {
        set({ userData });
      }
    } catch (err) {
      console.error("Invalid token", err);
      set({ userId: null, decodedData: null, userData: null, isAuthenticated: false });
    }
  },

  clearUser: () => {
    localStorage.removeItem("accessToken");
    set({ userId: null, decodedData: null, userData: null, isAuthenticated: false });
  },

  getUserData: async (userId: number) => {
    if (!userId) return null;
    try {
      const data = await userService.getUser(userId);
      set({ userData: data });
      return data;
    } catch (err: any) {
      console.error("Failed to fetch user data", err);
      set({ userData: null });
      return null;
    }
  },
}));
