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
import EditUser from "../../components/EditUser";

export type ApiUser = {
  id: string;
  nome: string;
  email: string;
  perfil_id?: string | null;
  perfil?: {
    id: string;
    nome: string;
  } | null;
};

const PERFIL_LABELS: Record<string, string> = {
  "00000000-0000-0000-0000-000000000001": "Administrador",
  "00000000-0000-0000-0000-000000000002": "Usuário Padrão",
};

export const columns: ColumnDef<ApiUser>[] = [
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
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Nome
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-800">{row.getValue("nome")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Email
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[260px] truncate text-sm text-gray-700">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    id: "perfil",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Perfil
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    accessorFn: (row) => {
      const perfilId = row.perfil?.id ?? row.perfil_id ?? "";
      return PERFIL_LABELS[perfilId] ?? row.perfil?.nome ?? "Não informado";
    },
    cell: ({ row }) => {
      const perfilId = row.original.perfil?.id ?? row.original.perfil_id ?? "";
      const perfilLabel =
        PERFIL_LABELS[perfilId] ?? row.original.perfil?.nome ?? "Não informado";

      const isAdmin = perfilId === "00000000-0000-0000-0000-000000000001";

      return (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            isAdmin
              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
              : "bg-slate-50 text-slate-700 ring-1 ring-slate-200"
          }`}
        >
          {perfilLabel}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-xs text-gray-800">Ações</div>
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
              className="w-36 rounded-xl border border-gray-100 bg-white p-2 shadow-md"
            >
              <DropdownMenuLabel className="px-2 py-1 text-xs text-gray-500">
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

              <EditUser user={{ id: user.id }}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5 text-gray-400" />
                  Editar
                </DropdownMenuItem>
              </EditUser>

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
