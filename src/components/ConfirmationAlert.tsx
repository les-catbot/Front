"use client";

import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../components/ui/alert-dialog";
import { CheckCircle2, XCircle } from "lucide-react";

interface ConfirmationAlertProps {
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  type: "success" | "error";
  title: string;
  description: string;
  onClose: () => void;
  onCloseSheet?: () => void;
}

export function ConfirmationAlert({
  open,
  onOpenChange,
  type,
  title,
  description,
  onClose,
  onCloseSheet,
}: ConfirmationAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={`max-w-sm rounded-2xl p-6 text-center border-none shadow-xl 
        ${type === "success" ? "bg-white" : "bg-white"}`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          {type === "success" ? (
            <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600 mb-3" />
          )}
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-800">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-sm">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <motion.button
            onClick={() => {
              onClose();
              onCloseSheet?.();
              onOpenChange(false);
            }}
            className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === "success"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            OK
          </motion.button>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
