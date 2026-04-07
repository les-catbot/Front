"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface ConfirmationAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
  onCloseSheet?: () => void;
  type: "success" | "error";
  title: string;
  description: string;
}

export function ConfirmationAlert({
  open,
  onOpenChange,
  onClose,
  onCloseSheet,
  type,
  title,
  description,
}: ConfirmationAlertProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        onClose?.();
        onCloseSheet?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange, onClose, onCloseSheet]);

  const isSuccess = type === "success";

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
              className="flex flex-col items-center gap-3 rounded-2xl bg-white/95 p-6 text-center shadow-2xl backdrop-blur-md border border-gray-100 max-w-sm mx-auto"
            >
              {isSuccess ? (
                <CheckCircle2 className="h-12 w-12 text-green-500 drop-shadow-md" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500 drop-shadow-md" />
              )}

              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                {title}
              </AlertDialogTitle>

              <AlertDialogDescription className="text-sm text-gray-600">
                {description}
              </AlertDialogDescription>

              <div
                className={`h-1 w-24 mt-2 rounded-full ${
                  isSuccess ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              ></div>
            </motion.div>
          </AlertDialogContent>
        )}
      </AnimatePresence>
    </AlertDialog>
  );
}
