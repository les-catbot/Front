"use client";

import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

interface FeedbackAlertProps {
  type: "success" | "error";
  title: string;
  description: string;
}

export function FeedbackAlert({ type, title, description }: FeedbackAlertProps) {
  const isSuccess = type === "success";

  return (
    <Alert
      variant={isSuccess ? "default" : "destructive"}
      className="mt-4 border border-gray-300"
    >
      {isSuccess ? (
        <CheckCircle2Icon className="text-green-600" />
      ) : (
        <AlertCircleIcon className="text-red-600" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
