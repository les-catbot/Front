"use client";

import { useState } from "react";
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
  Trash2,
  Pencil,
} from "lucide-react";
import type { Arquivo } from "../../model/Arquivo";
import { DeleteGeneric } from "../../components/DeleteGeneric";
import EditArquivo from "../../components/EditArquivos";

const formatarData = (data: string) => {
  if (!data) return "";

  const date = new Date(data);

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();

  return `${dia}-${mes}-${ano}`;
};

type GetColumnsProps = {
  toggleArquivoStatus: (id: string, ativo: boolean) => Promise<void>;
  onArquivosUpdated: () => Promise<void> | void;
  onViewHistory?: (arquivo: Arquivo) => void;
};

type ActionsCellProps = {
  arquivo: Arquivo;
  onArquivosUpdated: () => Promise<void> | void;
  onViewHistory?: (arquivo: Arquivo) => void;
};

function ActionsCell({
  arquivo,
  onArquivosUpdated,
}: ActionsCellProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/documentos/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir documento");
      }

      await onArquivosUpdated();
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

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
          className="w-44 rounded-xl border border-gray-100 bg-white p-2 text-black shadow-md"
        >
          <DropdownMenuLabel className="px-2 py-1 text-xs text-gray-500">
            Ações
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(arquivo.id)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copiar ID
          </DropdownMenuItem>

          <EditArquivo
            documento={arquivo}
            onArquivoUpdated={onArquivosUpdated}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
          </EditArquivo>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Excluindo..." : "Excluir"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteGeneric
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir documento?"
        description="Tem certeza que deseja excluir este documento? Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={() => handleDelete(arquivo.id)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export const getColumns = ({
  toggleArquivoStatus,
  onArquivosUpdated,
}: GetColumnsProps): ColumnDef<Arquivo>[] => [
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
    accessorKey: "titulo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Título
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-800">{row.getValue("titulo")}</div>
    ),
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Categoria
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-800">
        {row.getValue("categoria")}
      </div>
    ),
  },
  {
    accessorKey: "fonte",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Fonte
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[220px] truncate text-sm text-gray-800">
        {row.getValue("fonte")}
      </div>
    ),
  },
  {
    accessorKey: "versao",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Versão
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => {
      const versao = row.getValue("versao") as number | null | undefined;

      return (
        <div className="flex">
          <div className="rounded bg-gray-100 px-2 py-1 text-xs font-medium">
            v{versao ?? 1}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "criadoEm",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Criado em
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">
        {formatarData(row.getValue("criadoEm") as string)}
      </div>
    ),
  },
  {
    id: "ativo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 text-sm text-gray-700 hover:bg-transparent"
      >
        Status
        <ArrowUpDown className="ml-1 h-3 w-3 text-gray-400" />
      </Button>
    ),
    accessorFn: (row) => (row.ativo ? "Ativo" : "Inativo"),
    cell: ({ row }) => {
      const arquivo = row.original;

      return (
        <button
          type="button"
          onClick={() => toggleArquivoStatus(arquivo.id, !arquivo.ativo)}
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            arquivo.ativo
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-red-50 text-red-700 ring-1 ring-red-200"
          }`}
        >
          {arquivo.ativo ? "Ativo" : "Inativo"}
        </button>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center text-xs text-gray-800">Ações</div>
    ),
    cell: ({ row }) => (
      <ActionsCell
        arquivo={row.original}
        onArquivosUpdated={onArquivosUpdated}
      />
    ),
    size: 50,
  },
];