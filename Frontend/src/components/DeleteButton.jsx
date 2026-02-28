import React from 'react';
import { CircleX } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import axios from 'axios';

const backendUrl = import.meta.env.BACKEND_URL;

// Reusable DeleteButton component
const DeleteButton = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await onDelete(id);
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <CircleX className="hover:cursor-pointer hover:text-purple-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
