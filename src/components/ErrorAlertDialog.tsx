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
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

interface DeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteAlert({ open, onOpenChange, onConfirm }: DeleteAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <AlertDialogContent asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 rounded-2xl bg-white/95 p-6 text-center shadow-2xl backdrop-blur-md border border-gray-100 max-w-sm mx-auto"
            >
              <Trash2 className="h-12 w-12 text-red-500 drop-shadow-md" />

              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                  Confirmar exclusão
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-600">
                  Tem certeza de que deseja excluir este item? Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex gap-3 mt-2 justify-center">
                <AlertDialogCancel
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                  onClick={() => {
                    onConfirm();
                    onOpenChange(false);
                  }}
                >
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          </AlertDialogContent>
        )}
      </AnimatePresence>
    </AlertDialog>
  );
}
