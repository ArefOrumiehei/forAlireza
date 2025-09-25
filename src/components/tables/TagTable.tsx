// src/components/TagTable.tsx
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

type Tag = {
  id: number;
  name: string;
};

export default function TagTable() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tag"); // فرض می‌کنیم endpoint کلی /tag داریم
      setTags(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.put(`/tag/${editId}`, { name });
      } else {
        await api.post("/tag", { name });
      }
      setName("");
      setEditId(null);
      setIsOpen(false);
      fetchTags();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tag/${id}`);
      fetchTags();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (tag: Tag) => {
    setEditId(tag.id);
    setName(tag.name);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tags</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsOpen(true)}>Add Tag</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Tag" : "Add Tag"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Tag name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.id}</TableCell>
                <TableCell>{tag.name}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    className="bg-blue-500 hover:bg-blue-400"
                    onClick={() => openEdit(tag)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="bg-red-500"
                    onClick={() => handleDelete(tag.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
