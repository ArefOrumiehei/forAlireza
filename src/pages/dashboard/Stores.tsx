import CreateModal from "@/components/common/modals/CreateModal";
import StoreTable from "@/components/tables/StoreTable";
import { Input } from "@/components/ui/input";
import { useStoreStore } from "@/stores/storeStore";
import { useState } from "react";

export default function Stores() {
  const { loading, createStore } = useStoreStore();

  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [createOpen, setCreateOpen] = useState(false);

  const handleCreate = async (name: string, tags: number[]) => {
    await createStore(name, tags);
    setCreateOpen(false);
    setName("");
    setSelectedTags([]);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Stores</h2>
        <CreateModal
          isOpen={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={() => handleCreate(name, selectedTags)}
          isLoading={loading}
          usedFor={"Store"}
        >
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          {/* {allTags.length > 0 && (
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
          )} */}
        </CreateModal>
      </div>

      <StoreTable />
    </div>
  )
}
