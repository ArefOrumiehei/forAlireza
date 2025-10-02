export type Item = {
  store: any; id: number; name: string; price: number 
};
export type Tag = { id: number; name: string };
export type Store = { id: number; name: string; items: Item[]; tags: Tag[] };
