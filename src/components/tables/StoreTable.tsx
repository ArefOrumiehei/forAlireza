import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";
import { Link } from "react-router-dom";
import { Edit, Trash } from "lucide-react";

type Item = { id: number; name: string; price: number };
type Tag = { id: number; name: string };
type Store = { id: number; name: string; items: Item[]; tags: Tag[] };

export default function StoreTable() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // form states
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  // fetch stores
  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get("/store");
      setStores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTags = async () => {
    try {
      const storeRes = await api.get("/store");
      const tagsSet = new Map<number, Tag>();
      storeRes.data.forEach((store: Store) => {
        store.tags.forEach((tag) => {
          tagsSet.set(tag.id, tag);
        });
      });
      setAllTags(Array.from(tagsSet.values()));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchAllTags();
  }, []);

  const handleSubmit = async () => {
    try {
      let storeId: number;
      if (editId) {
        await api.put(`/store/${editId}`, { name });
        storeId = editId;
      } else {
        const res = await api.post("/store", { name });
        storeId = res.data.id;
      }

      const currentStore = stores.find((s) => s.id === storeId);
      const currentTags = currentStore ? currentStore.tags.map((t) => t.id) : [];
      const tagsToAdd = selectedTags.filter((id) => !currentTags.includes(id));
      const tagsToRemove = currentTags.filter((id) => !selectedTags.includes(id));

      for (const tagId of tagsToAdd) {
        await api.post(`/store/${storeId}/tag/${tagId}`);
      }
      for (const tagId of tagsToRemove) {
        await api.delete(`/store/${storeId}/tag/${tagId}`);
      }

      setName("");
      setSelectedTags([]);
      setEditId(null);
      setIsOpen(false);
      fetchStores();
      fetchAllTags();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/store/${id}`);
      fetchStores();
      fetchAllTags();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (store: Store) => {
    setEditId(store.id);
    setName(store.name);
    setSelectedTags(store.tags.map((t) => t.id));
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Stores</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>Add Store</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Store" : "Add Store"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <h3 className="text-sm">Tags</h3>
                <div className="space-x-2">
                  {allTags.map((tag) => (
                    <label key={tag.id} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={tag.id}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag.id)
                              ? prev.filter((id) => id !== tag.id)
                              : [...prev, tag.id]
                          );
                        }}
                      />
                      <span className="ml-2">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.id}</TableCell>
                <TableCell>
                  <Link
                    to={`/stores/${store.id}`}
                    className="text-black-300 underline"
                  >
                    {store.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {store.items.length > 0 ? (
                    <span>{store.items.length}</span>
                  ) : (
                    <span className="text-neutral-400">No items</span>
                  )}
                </TableCell>
                <TableCell>
                  {store.tags.length > 0
                    ? store.tags.map((t) => t.name).join(", ")
                    : <span className="text-neutral-400">No tags</span>}
                </TableCell>
                <TableCell className="flex align-center justify-center gap-4">
                  <Edit className="cursor-pointer" onClick={() => openEdit(store)} />
                  <Trash className="cursor-pointer" onClick={() => handleDelete(store.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
