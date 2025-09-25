// src/components/StoreForm.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";

type Tag = { id: number; name: string };
type Store = { id: number; name: string; tags: Tag[] };

type StoreFormProps = {
  initialData?: Store;
  onSubmit: (data: { name: string; tagIds: number[] }) => void;
  triggerText: string; // متن دکمه
};

export default function StoreForm({ initialData, onSubmit, triggerText }: StoreFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [tags, setTags] = useState<number[]>(initialData?.tags.map(t => t.id) || []);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/store/1/tag"); // فقط مثال، ممکنه endpoint رو تغییر بدی
        setAllTags(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTags();
  }, []);

  const handleSubmit = async () => {
    await onSubmit({ name, tagIds: tags });
    setIsOpen(false);
    setName("");
    setTags([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Store" : "Add Store"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            multiple
            className="border p-2 w-full"
            value={tags.map(String)}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
              setTags(selected);
            }}
          >
            {allTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <Button onClick={handleSubmit}>{initialData ? "Update" : "Create"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
