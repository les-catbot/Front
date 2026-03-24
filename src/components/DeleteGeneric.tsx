"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

interface DeleteGenericProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteGeneric({
  isOpen,
  onClose,
  title = "Tem certeza que deseja excluir?",
  description = "Essa ação não pode ser desfeita.",
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  onConfirm,
  isDeleting = false,
}: DeleteGenericProps) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open: boolean) => !open && onClose()}
    >
      <AlertDialogContent className="bg-white text-black rounded-xl shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black-600 text-lg font-semibold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            onClick={onClose}
            className="border border-gray-300 hover:bg-gray-100"
          >
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? "Excluindo..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}