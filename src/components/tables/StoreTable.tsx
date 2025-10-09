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
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Items Count</TableHead>
              <TableHead className="text-center">Tags Count</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.id}</TableCell>
                <TableCell className="text-center text-black-500 hover:text-blue-700">
                  <Link to={`/stores/${store.id}`}>
                    {store.name}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {store.items.length > 0 ? (
                    <span className="text-black-500">{store.items.length}</span>
                  ) : (
                    <span className="text-neutral-400">No items</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {store.tags.length > 0
                    ? 
                      <Link to={`/stores/${store.id}/tags`} className="text-black-500">
                        {store.tags.length} <span className="text-neutral-400 hover:underline">(See details)</span>
                      </Link>
                    : <Link to={`/stores/${store.id}/tags`} className="text-neutral-400 hover:underline">
                        Create Tag +
                      </Link>}
                </TableCell>
                <TableCell className="flex align-center justify-center gap-4">
                  <Edit
                    className="cursor-pointer hover:text-blue-400"
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
