import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
  usedFor: string;
  children?: React.ReactNode;
}

export default function EditModal({ isOpen, onOpenChange, children, onSubmit, isLoading, usedFor }: EditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {usedFor}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {children}

          <Button className="cursor-pointer" disabled={isLoading} onClick={onSubmit}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
