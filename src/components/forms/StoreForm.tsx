import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Store, Tag } from "@/types/storeTypes";

interface StoreFormProps {
  store?: Store | null;
  allTags: Tag[];
  onSubmit: (params: { id: number; name: string; tags: number[] } | { name: string; tags: number[] }) => Promise<void>;
  onClose: () => void;
}

export default function StoreForm({ store, allTags, onSubmit, onClose }: StoreFormProps) {
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    if (store) {
      setName(store.name);
      setSelectedTags(store.tags.map((t) => t.id));
    } else {
      setName("");
      setSelectedTags([]);
    }
  }, [store]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (store) {
      await onSubmit({ id: store.id, name, tags: selectedTags });
    } else {
      await onSubmit({ name, tags: selectedTags });
    }

    onClose();
  };

  return (
    <div className="space-y-3">
      <DialogHeader>
        <DialogTitle>{store ? "Edit Store" : "Add Store"}</DialogTitle>
      </DialogHeader>

      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

      {allTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {allTags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
                    )
                  }
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleSubmit}>{store ? "Update" : "Create"}</Button>
    </div>
  );
}
