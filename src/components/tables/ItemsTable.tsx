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
import { Edit } from "lucide-react";
// import CreateModal from "../common/modals/CreateModal";
import EditModal from "../common/modals/EditModal";
import DeleteModal from "../common/modals/DeleteModal";
import { Input } from "@/components/ui/input";

type Item = {
  id: number;
  name: string;
  price: number;
  store: { id: number; name: string };
};

export default function ItemsTable() {
  const { items, loading, fetchItems, updateItem, deleteItem } =
    useItemStore();

  // const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [name, setName] = useState("");
  // const [newItemName, setNewItemName] = useState("");
  const [price, setPrice] = useState("");
  // const [newItemPrice, setNewItemPrice] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  // const handleCreate = async () => {
  //   if (!name.trim() || price === "") return;
  //   await createItem(storeId, name, parseFloat(price));
  //   setCreateOpen(false);
  //   setNewItemName("");
  //   setNewItemPrice("");
  // };

  const handleOpenEdit = (item: Item) => {
    setEditItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editItem || !name.trim() || price === "") return;
    await updateItem(editItem.id, editItem.store.id, name, parseFloat(price));
    setEditOpen(false);
    setEditItem(null);
    fetchItems();
    setName("");
    setPrice("");
  };

  const handleDelete = async (id: number, storeId: number) => {
    await deleteItem(id, storeId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Items</h2>
        {/* <CreateModal
          isOpen={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
          usedFor="Item"
          isLoading={loading}
        >
          <Input
            placeholder="Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
          />
        </CreateModal> */}
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
        </EditModal>
      )}

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
                <TableCell>{item.store.name}</TableCell>
                <TableCell className="flex justify-center gap-4">
                  <Edit
                    className="cursor-pointer"
                    onClick={() => handleOpenEdit(item)}
                  />
                  <DeleteModal
                    isOpen={deleteId === item.id}
                    onOpenChange={(open) =>
                      setDeleteId(open ? item.id : null)
                    }
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
