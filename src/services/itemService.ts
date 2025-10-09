// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";
import type { Store } from "@/types/storeTypes";

export const itemService = {
  fetchStore: async (storeId: number): Promise<Store> => {
    const res = await api.get(`/store/${storeId}`);
    return res.data;
  },

  getItems: async () => {
    const res = await api.get("/item");
    return res;
  },

  getItem: async (itemId: number) => {
    const res = await api.get(`/item/${itemId}`)
    return res;
  },

  createItem: async (storeId: number, name: string, price: number, desc: string) => {
    await api.post("/item", { store_id: storeId, name, price, description: desc });
  },

  updateItem: async (id: number, name: string, price: number, desc: string) => {
    await api.put(`/item/${id}`, { name, price, description: desc });
  },

  deleteItem: async (id: number) => {
    await api.delete(`/item/${id}`);
  },
};
