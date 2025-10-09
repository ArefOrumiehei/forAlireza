/* eslint-disable @typescript-eslint/no-explicit-any */
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

import CreateModal from "../common/modals/CreateModal";
import EditModal from "../common/modals/EditModal";
import { Skeleton } from "@/components/ui/skeleton"
import DeleteModal from "../common/modals/DeleteModal";
import { useStoreStore } from "@/stores/storeStore";
import type { Tag } from "@/types/storeTypes";

export default function StoreTagsDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const storeId = Number(id);

  const {getTagsOfStore, addTagToStore, removeTagFromStore, getStoreById, editTag, currentStore, storeTags, loading} = useStoreStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (!isNaN(storeId)){
      getStoreById(storeId)
      getTagsOfStore(storeId)
    };
  }, [storeId]);

  const handleOpenEdit = (tag: Tag) => {
    setEditItem(tag);
    setTagName(tag.name);
    setEditOpen(true);
  };

  const handleCreate = async () => {
    if (!tagName.trim()) return;
    await addTagToStore(storeId, tagName);

    setCreateOpen(false);
    setTagName("");
  };

  const handleEdit = async () => {
    if (!editItem || !tagName.trim()) return;
    await editTag(editItem.id, storeId, tagName);
    setEditOpen(false);
    setEditItem(null);
    setTagName("");
  };

  const handleDelete = async (id: number) => {
    await removeTagFromStore(id);
    setDeleteId(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate("/stores")} />
        <div className="text-2xl font-bold">
          <h3 className="flex items-center justify-center gap-2">Store {loading ? <Skeleton className="h-6 w-[100px] bg-neutral-300" /> : currentStore?.name} Tags</h3>
        </div>
        <CreateModal
          isOpen={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={() => handleCreate()}
          usedFor="Tag"
          isLoading={loading}
        >
          <Input
            placeholder="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
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
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
        </EditModal>
      )}

      {/* Items Table */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : storeTags.length === 0 ? (
        <p className="text-gray-500 italic">No Tags are created in this store yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Items count</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeTags?.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.id}</TableCell>
                <TableCell className="text-center">{tag.name}</TableCell>
                <TableCell className="text-center">{tag.items?.length}</TableCell>
                <TableCell className="flex justify-center gap-4">
                  <Edit
                    className="cursor-pointer hover:text-blue-400"
                    onClick={() => handleOpenEdit(tag)}
                  />
                  <DeleteModal
                    isOpen={deleteId === tag.id}
                    onOpenChange={(open) => setDeleteId(open ? tag.id : null)}
                    itemName={tag.name}
                    onConfirm={() => handleDelete(tag.id)}
                    usedFor="Tag"
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
