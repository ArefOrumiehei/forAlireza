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
  refreshUserData: () => Promise<void>;
};

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  decodedData: null,
  userData: null,
  isAuthenticated: false,

  setUserFromToken: async (token) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      localStorage.setItem("accessToken", token);

      set({
        userId: decoded.sub,
        decodedData: decoded,
        isAuthenticated: true,
      });

      await get().refreshUserData();
    } catch (err) {
      console.error("Invalid token", err);
      set({ userId: null, decodedData: null, userData: null, isAuthenticated: false });
    }
  },

  clearUser: () => {
    localStorage.removeItem("accessToken");
    set({ userId: null, decodedData: null, userData: null, isAuthenticated: false });
  },

  refreshUserData: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      const data = await userService.getUser(Number(userId));
      set({ userData: data });
    } catch (err: any) {
      console.error("Failed to fetch user data", err);
      set({ userData: null });
    }
  },
}));
