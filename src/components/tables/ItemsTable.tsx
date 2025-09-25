/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ItemTable.tsx
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";
import { Edit, Trash } from "lucide-react";


type Item = {
  id: number;
  name: string;
  price: number;
  store: any
};

export default function ItemsTable() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [editId, setEditId] = useState<number | null>(null);

  // fetch items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/item");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.put(`/item/${editId}`, { name, price });
      } else {
        await api.post("/item", { name, price });
      }
      setName("");
      setPrice("");
      setEditId(null);
      fetchItems();
      setOpenDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/item/${id}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: Item) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Items</h2>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Item" : "Add Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <Button onClick={handleSubmit}>
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-400">No items available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Store</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  {item.store.name}
                </TableCell>

                <TableCell className="flex align-center justify-center gap-4">
                  <Edit className="cursor-pointer" onClick={() => openEdit(item)} />
                  <Trash className="cursor-pointer" onClick={() => handleDelete(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
