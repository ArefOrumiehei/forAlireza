// DeleteModal.tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: () => void;
  usedFor: string;
}

export default function DeleteModal({ isOpen, onOpenChange, itemName, onConfirm, usedFor }: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Trash className="cursor-pointer hover:text-red-500" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {usedFor}</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete "{itemName}"?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button className="cursor-pointer" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="cursor-pointer" variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
