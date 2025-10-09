import { create } from "zustand";
import type { Item, Store } from "@/types/storeTypes";
import { itemService } from "@/services/itemService";

interface ItemStoreState {
  store: Store;
  items: Item[];
  loading: boolean;
  fetchStore: (storeId: number) => Promise<void>;
  fetchItems: () => Promise<void>;
  createItem: (storeId: number, name: string, price: number, desc: string) => Promise<void>;
  updateItem: (id: number, storeId: number, name: string, price: number, desc: string) => Promise<void>;
  deleteItem: (id: number, storeId: number) => Promise<void>;
}

export const useItemStore = create<ItemStoreState>((set, get) => ({
  store: { id: 0, name: "", items: [], tags: [] },
  items: [],
  loading: false,

  fetchStore: async (storeId) => {
    set({ loading: true });
    try {
      const store = await itemService.fetchStore(storeId);
      set({ store });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  fetchItems: async () => {
    set({ loading: true });
    try {
      const res = await itemService.getItems();
      set({ items: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  createItem: async (storeId, name, price, desc) => {
    try {
      await itemService.createItem(storeId, name, price, desc);
      await get().fetchStore(storeId);
    } catch (err) {
      console.error(err);
    }
  },

  updateItem: async (id, storeId, name, price, desc) => {
    try {
      await itemService.updateItem(id, name, price, desc);
      await get().fetchStore(storeId);
    } catch (err) {
      console.error(err);
    }
  },

  deleteItem: async (id, storeId) => {
    try {
      await itemService.deleteItem(id);
      await get().fetchStore(storeId);
    } catch (err) {
      console.error(err);
    }
  },
}));
