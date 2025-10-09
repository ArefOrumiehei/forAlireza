/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useItemStore } from "@/stores/itemStore";
import CreateModal from "../common/modals/CreateModal";
import EditModal from "../common/modals/EditModal";
import { Skeleton } from "@/components/ui/skeleton"
import DeleteModal from "../common/modals/DeleteModal";

type StoreItem = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export default function StoreDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const storeId = Number(id);

  const { store, loading, fetchStore, createItem, updateItem, deleteItem } = useItemStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<StoreItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");


  useEffect(() => {
    if (!isNaN(storeId)) fetchStore(storeId);
  }, [storeId]);

  const handleOpenEdit = (item: StoreItem) => {
    setEditItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setDescription(item.description);
    setEditOpen(true);
  };

  const handleCreate = async () => {
    if (!name.trim() || price === "") return;
    await createItem(storeId, name, parseFloat(price), description);
    setCreateOpen(false);
    setName("");
    setPrice("");
    setDescription("");
  };

  const handleEdit = async () => {
    if (!editItem || !name.trim() || price === "") return;
    await updateItem(editItem.id, storeId, name, parseFloat(price), description);
    setEditOpen(false);
    setEditItem(null);
    setName("");
    setPrice("");
    setDescription("");
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id, storeId);
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate("/stores")} />
        <div className="text-2xl font-bold">
          <h3 className="flex items-center justify-center gap-2">Store {loading ? <Skeleton className="h-6 w-[100px] bg-neutral-300" /> : store.name} Items</h3>
        </div>
        <CreateModal
          isOpen={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          usedFor="Item"
          isLoading={loading}
        >
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </CreateModal>
      </div>


      {editItem && (
        <EditModal
          isOpen={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={handleEdit}
          usedFor="Item"
          isLoading={loading}
        >
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </EditModal>
      )}

      {/* Items Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : store.items.length === 0 ? (
        <p className="text-gray-500 italic">No items available in this store.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {store.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">
                  {item.description?.length > 30
                    ? `${item.description.slice(0, 30)}...`
                    : item.description || "-"}
                </TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="flex justify-center gap-4 text-center">
                  <Edit
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => handleOpenEdit(item)}
                  />
                  <DeleteModal
                    isOpen={deleteId === item.id}
                    onOpenChange={(open) => setDeleteId(open ? item.id : null)}
                    itemName={item.name}
                    onConfirm={() => handleDelete(item.id)}
                    usedFor="Item"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
