import { create } from "zustand";
import { toast } from "react-toastify";
import { storeService } from "@/services/storeService";
import type { Store, Tag, Tags } from "@/types/storeTypes";

type StoreState = {
  stores: Store[];
  currentStore: Store | null;
  storeTags: Tags[];
  allTags: Tag[];
  loading: boolean;

  fetchStores: () => Promise<void>;
  fetchAllTags: () => Promise<void>;
  createStore: (name: string, selectedTags: number[]) => Promise<void>;
  updateStore: (id: number, name: string, selectedTags: number[]) => Promise<void>;
  deleteStore: (id: number) => Promise<void>;
  getStoreById: (storeId: number) => Promise<void>;
  getTagsOfStore: (storeId: number) => Promise<Tag[]>;
  addTagToStore: (storeId: number, tagName: string) => Promise<void>;
  editTag: (tagId: number, storeId: number, tagName: string) => Promise<void>;
  removeTagFromStore: (tagId: number) => Promise<void>;
};

export const useStoreStore = create<StoreState>((set, get) => ({
  stores: [],
  currentStore: null,
  storeTags: [],
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

  getStoreById: async (storeId: number) => {
    set({ loading: true });
    try {
      const store = await storeService.getStore(storeId);
      set({ currentStore: store });
    } catch (err) {
      console.error(err);
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
        const tagName = get().allTags.find((t) => t.id === tagId)?.name;
        if (tagName) await storeService.addTagToStore(storeId, tagName);
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

      const currentTags = await storeService.getTagsOfStore(id);
      const currentTagIds = currentTags.map((t) => t.id);

      const tagsToAdd = selectedTags.filter((tagId) => !currentTagIds.includes(tagId));
      const tagsToRemove = currentTagIds.filter((tagId) => !selectedTags.includes(tagId));

      for (const tagId of tagsToAdd) {
        const tagName = get().allTags.find((t) => t.id === tagId)?.name;
        if (tagName) await storeService.addTagToStore(id, tagName);
      }

      for (const tagId of tagsToRemove) {
        await storeService.deleteTag(tagId);
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
      set({ currentStore: null, storeTags: [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete store");
    }
  },

  addTagToStore: async (storeId, tagName) => {
    try {
      await storeService.addTagToStore(storeId, tagName);
      toast.success("Tag added to store");
      await Promise.all([
        get().getStoreById(storeId),
        get().getTagsOfStore(storeId),
        get().fetchAllTags(),
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add tag to store");
    }
  },

  removeTagFromStore: async (tagId) => {
    try {
      await storeService.deleteTag(tagId);
      toast.success("Tag removed from store");
      const currentStore = get().currentStore;
    if (currentStore) {
      await get().getTagsOfStore(currentStore.id);
    }

    await get().fetchAllTags();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove tag from store");
    }
  },

  getTagsOfStore: async (storeId) => {
    try {
      const tags = await storeService.getTagsOfStore(storeId);
      set({ storeTags: tags });
      return tags;
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tags of the store");
      set({ storeTags: [] });
      return [];
    }
  },

  editTag: async (tagId, storeId, tagName) => {
    try {
      await storeService.editTag(tagId, tagName);
      await Promise.all([
        get().getTagsOfStore(storeId),
        get().fetchAllTags(),
      ]);
      toast.success("Tag updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to edit tag, Please try again.");
    }
  }
}));
