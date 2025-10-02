import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CreateModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => Promise<void>;
  children?: React.ReactNode;
  isLoading?: boolean;
  usedFor: string;
}

export default function CreateModal({ isOpen, onOpenChange, onSubmit, children, isLoading, usedFor }: CreateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" disabled={isLoading}>{`Create ${usedFor}`}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Create ${usedFor}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {children}
          <Button className="cursor-pointer" disabled={isLoading} onClick={onSubmit}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
