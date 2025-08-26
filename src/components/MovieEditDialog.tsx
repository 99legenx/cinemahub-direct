import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import MovieUploadForm from "./MovieUploadForm";

interface MovieEditDialogProps {
  movie: any;
  onSuccess: () => void;
}

export default function MovieEditDialog({ movie, onSuccess }: MovieEditDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Movie: {movie.title}</DialogTitle>
        </DialogHeader>
        <MovieUploadForm 
          existingMovie={movie} 
          isEditing={true} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
}