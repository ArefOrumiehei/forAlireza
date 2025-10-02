/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { toast } from "react-toastify";
import { storeService } from "@/services/storeService";
import type { Store, Tag } from "@/types/storeTypes";

type StoreState = {
  stores: Store[];
  allTags: Tag[];
  loading: boolean;
  fetchStores: () => Promise<void>;
  fetchAllTags: () => Promise<void>;
  createStore: (name: string, selectedTags: number[]) => Promise<void>;
  updateStore: (id: number, name: string, selectedTags: number[]) => Promise<void>;
  deleteStore: (id: number) => Promise<void>;
};

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  allTags: [],
  loading: false,

  fetchStores: async () => {
    set({ loading: true });
    try {
      const stores = await storeService.fetchStores();
      set({ stores });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stores");
    } finally {
      set({ loading: false });
    }
  },

  fetchAllTags: async () => {
    try {
      const tags = await storeService.fetchAllTags();
      set({ allTags: tags });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tags");
    }
  },

  createStore: async (name, selectedTags) => {
    try {
      const storeId = await storeService.createStore(name);

      for (const tagId of selectedTags) {
        await storeService.addTagToStore(storeId, tagId);
      }

      toast.success("Store created");
      await get().fetchStores();
      await get().fetchAllTags();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create store");
    }
  },

  updateStore: async (id, name, selectedTags) => {
    try {
      await storeService.updateStore(id, name);

      const currentStore = get().stores.find((s) => s.id === id);
      const currentTags = currentStore ? currentStore.tags.map((t: { id: any; }) => t.id) : [];

      const tagsToAdd = selectedTags.filter((id) => !currentTags.includes(id));
      const tagsToRemove = currentTags.filter((id: number) => !selectedTags.includes(id));

      for (const tagId of tagsToAdd) {
        await storeService.addTagToStore(id, tagId);
      }
      for (const tagId of tagsToRemove) {
        await storeService.removeTagFromStore(id, tagId);
      }

      toast.success("Store updated");
      await get().fetchStores();
      await get().fetchAllTags();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update store");
    }
  },

  deleteStore: async (id) => {
    try {
      await storeService.deleteStore(id);
      toast.info("Store deleted 🗑️");
      await get().fetchStores();
      await get().fetchAllTags();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete store");
    }
  },
}));