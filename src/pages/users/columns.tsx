"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  ArrowUpDown,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="h-4 w-4"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="h-4 w-4"
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
    size: 32,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-600 hover:bg-transparent"
      >
        Nome
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-800">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: () => <div className="text-sm text-gray-500">Usuário</div>,
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-sm text-gray-500">Email</div>,
    cell: ({ row }) => (
      <div className="text-sm text-gray-700 truncate">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => (
      <div className="text-xs text-gray-400 text-center">Ações</div>
    ),
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white border border-gray-100 shadow-md rounded-xl p-2 w-35"
            >
              <DropdownMenuLabel className="text-xs text-gray-500 px-2 py-1">
                Ações
              </DropdownMenuLabel>

              <DropdownMenuItem
                className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100"
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                <Copy className="h-3.5 w-3.5 text-gray-400" />
                Copiar ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100">
                <Pencil className="h-3.5 w-3.5 text-gray-400" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-red-500">Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 50,
  },
];
