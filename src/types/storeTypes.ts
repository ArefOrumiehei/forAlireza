/* eslint-disable @typescript-eslint/no-explicit-any */
export type Item = {
  store: any; id: number; name: string; price: number; description: string;
};
export type Tag = { id: number; name: string };
export type Tags = { id: number; name: string, items?: Item[]};
export type Store = { id: number; name: string; items: Item[]; tags: Tag[] };
