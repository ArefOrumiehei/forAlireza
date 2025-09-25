import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import api from "@/api/axiosInstance";
import {
  Table,
  TableBody,
  TableCaption,
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
import { ArrowLeft, Edit, Trash } from "lucide-react";

type StoreItem = {
  id: number;
  name: string;
  price: number;
};

function StoreDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [items, setItems] = useState<StoreItem[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // fetch store items
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/store/${id}`);
      setItems(res.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // handle add/edit item
  const handleSubmit = async () => {
    try {
      if (editId) {
        await api.put(`/item/${editId}`, {
          name,
          price: parseFloat(price),
        });
      } else {
        await api.post("/item", {
          name,
          price: parseFloat(price),
          store_id: Number(id),
        });
      }
      setName("");
      setPrice("");
      setEditId(null);
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // handle delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/item/${deleteId}`);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: StoreItem) => {
    setEditId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setOpenDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <ArrowLeft 
          className="cursor-pointer" 
          onClick={() => navigate("/stores")}  
        />
        <h1 className="text-2xl font-bold">Store {id} Items</h1>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditId(null)} className="cursor-pointer">Add Item</Button>
          </DialogTrigger>
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
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Button onClick={handleSubmit}>
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ?
        <p className="text-gray-500">Loading...</p>
      :
        items.length === 0 ? (
          <p className="text-gray-500 italic">No items available in this store.</p>
        ) : (
          <Table>
            <TableCaption>Items available in this store</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">{item.price}</TableCell>
                  <TableCell className="flex align-center justify-center gap-4">
                    <Edit className="cursor-pointer" onClick={() => openEdit(item)} />

                    {/* Delete Confirmation */}
                    <Dialog
                      open={deleteId === item.id}
                      onOpenChange={(open) =>
                        setDeleteId(open ? item.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Trash className="cursor-pointer" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Item</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete "{item.name}"?</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            variant="secondary"
                            onClick={() => setDeleteId(null)}
                          >
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDelete}>
                            Confirm
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      }
    </div>
  );
}

export default StoreDetails;
