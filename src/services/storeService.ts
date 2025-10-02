// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";
import type { Store, Tag } from "@/types/storeTypes";

export const storeService = {
  fetchStores: async (): Promise<Store[]> => {
    const res = await api.get("/store");
    return res.data;
  },

  fetchAllTags: async (): Promise<Tag[]> => {
    const storeRes = await api.get("/store");
    const tagsMap = new Map<number, Tag>();
    storeRes.data.forEach((store: Store) => {
      store.tags.forEach((tag) => tagsMap.set(tag.id, tag));
    });
    return Array.from(tagsMap.values());
  },

  createStore: async (name: string): Promise<number> => {
    const res = await api.post("/store", { name });
    return res.data.id;
  },

  getStore: async (storeId: number) => {
    await api.get(`/store/${storeId}`);
  },

  updateStore: async (id: number, name: string): Promise<void> => {
    await api.put(`/store/${id}`, { name });
  },

  addTagToStore: async (storeId: number, tagId: number) => {
    await api.post(`/store/${storeId}/tag/${tagId}`);
  },

  removeTagFromStore: async (storeId: number, tagId: number) => {
    await api.delete(`/store/${storeId}/tag/${tagId}`);
  },

  deleteStore: async (id: number) => {
    await api.delete(`/store/${id}`);
  },
};
