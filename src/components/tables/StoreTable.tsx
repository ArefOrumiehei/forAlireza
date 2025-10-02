/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { useStoreStore } from "@/stores/storeStore";
import type { Store } from "@/types/storeTypes";

import EditModal from "../common/modals/EditModal";
import { Input } from "../ui/input";
import DeleteModal from "../common/modals/DeleteModal";

export default function StoreTable() {
  const {
    stores,
    allTags,
    loading,
    fetchStores,
    fetchAllTags,
    updateStore,
    deleteStore,
  } = useStoreStore();

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  useEffect(() => {
    fetchStores();
    fetchAllTags();
  }, []);

  // Update name/tags when selectedStore changes
  useEffect(() => {
    if (selectedStore) {
      setName(selectedStore.name);
      setSelectedTags(selectedStore.tags.map((t) => t.id));
    } else {
      setName("");
      setSelectedTags([]);
    }
  }, [selectedStore]);

  const handleEdit = async (id: number, newName: string, tags: number[]) => {
    await updateStore(id, newName, tags);
    setEditOpen(false);
    setSelectedStore(null);
  };

  const handleDelete = async (id: number) => {
    await deleteStore(id);
    setDeleteId(null);
  };

  return (
    <>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : stores.length === 0 ? (
        <p className="text-gray-500">No stores found</p>
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
                  <Edit
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedStore(store);
                      setEditOpen(true);
                    }}
                  />

                  <DeleteModal
                    isOpen={deleteId === store.id}
                    onOpenChange={(open) =>
                      setDeleteId(open ? store.id : null)
                    }
                    itemName={store.name}
                    onConfirm={() => handleDelete(store.id)}
                    usedFor="Store"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedStore && (
        <EditModal
          isOpen={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={() => selectedStore && handleEdit(selectedStore.id, name, selectedTags)}
          isLoading={loading}
          usedFor="Store"
        >
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id]
                        )
                      }
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </EditModal>
      )}
    </>
  );
}
