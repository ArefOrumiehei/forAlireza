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
import { useItemStore } from "@/stores/itemStore";
import { useStoreStore } from "@/stores/storeStore";
import { Edit } from "lucide-react";
import EditModal from "../common/modals/EditModal";
import DeleteModal from "../common/modals/DeleteModal";
import CreateModal from "../common/modals/CreateModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Item = {
  id: number;
  name: string;
  price: number;
  description?: string;
  store: { id: number; name: string };
};

export default function ItemsTable() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } = useItemStore();
  const { stores, fetchStores } = useStoreStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  useEffect(() => {
    fetchItems();
    fetchStores();
  }, []);

  const handleOpenEdit = (item: Item) => {
    setEditItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setDescription(item.description || "");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editItem || !name.trim() || price === "") return;
    await updateItem(editItem.id, editItem.store.id, name, parseFloat(price), description);
    setEditOpen(false);
    setEditItem(null);
    setName("");
    setPrice("");
    setDescription("");
    fetchItems();
  };

  const handleCreate = async () => {
    if (!selectedStoreId || !name.trim() || price === "") return;
    await createItem(selectedStoreId, name, parseFloat(price), description);
    setCreateOpen(false);
    setName("");
    setPrice("");
    setDescription("");
    setSelectedStoreId(null);
    fetchItems();
  };

  const handleDelete = async (id: number, storeId: number) => {
    await deleteItem(id, storeId);
    setDeleteId(null);
    fetchItems();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Items</h2>

        <CreateModal
          isOpen={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          usedFor="Item"
          isLoading={loading}
        >
          <Select
            onValueChange={(value) => setSelectedStoreId(Number(value))}
            value={selectedStoreId ? selectedStoreId.toString() : ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price"
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
            type="number"
            placeholder="Price"
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

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-neutral-400 italic">No items available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Store</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell className="text-center">{item.name}</TableCell>
                <TableCell className="text-center">
                  {item.description?.length > 30
                    ? `${item.description.slice(0, 30)}...`
                    : item.description || "-"}
                </TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="text-center">{item.store.name}</TableCell>
                <TableCell className="flex justify-center gap-4">
                  <Edit
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => handleOpenEdit(item)}
                  />
                  <DeleteModal
                    isOpen={deleteId === item.id}
                    onOpenChange={(open) => setDeleteId(open ? item.id : null)}
                    itemName={item.name}
                    onConfirm={() => handleDelete(item.id, item.store.id)}
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
