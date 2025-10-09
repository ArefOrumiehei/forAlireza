// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";

export const userService = {
  getUser: async (userId: number) => {
    const res = await api.get(`/user/${userId}`);
    return res.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/user/${userId}`);
  },
};
