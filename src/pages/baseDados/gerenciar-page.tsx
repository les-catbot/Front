import { useEffect, useState } from "react";

import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "../../components/ui/sheet";
import { useSidebar } from "../../components/ui/sidebar";
import type { Arquivo } from "../../model/Arquivo";
import AddArquivos from "../../components/AddArquivos";
import { getColumns } from "./columns";

type DocumentoResponse = {
  id: string;
  titulo: string;
  categoria: string;
  fonte: string;
  criado_em: string;
  versao?: number;
};

const GerenciarBase = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [data, setData] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArquivos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/api/v1/documentos");

      if (!response.ok) {
        throw new Error("Erro ao buscar documentos");
      }

      const result: DocumentoResponse[] = await response.json();

      const documentosFormatados: Arquivo[] = result.map((doc) => ({
        id: doc.id,
        titulo: doc.titulo,
        categoria: doc.categoria,
        fonte: doc.fonte,
        criadoEm: doc.criado_em,
        versao: doc.versao ?? 1,
        ativo: true,
      }));

      setData(documentosFormatados);
    } catch (err) {
      setError("Não foi possível carregar os arquivos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArquivos();
  }, []);

  const toggleArquivoStatus = async (id: string, ativo: boolean) => {
    try {
      setData((prev) =>
        prev.map((arquivo) =>
          arquivo.id === id ? { ...arquivo, ativo } : arquivo
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const tableColumns = getColumns({
    toggleArquivoStatus,
    onArquivosUpdated: fetchArquivos,
  });

  return (
    <div
      className={`bg-white min-h-screen p-6 transition-all duration-300 ${
        isCollapsed ? "ml-3" : ""
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="w-64 rounded-md border border-gray-200 bg-white px-4 py-2 shadow-sm">
          <h1 className="font-semibold">Base de Dados</h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <div className="cursor-pointer rounded-md bg-[#457B9D] text-white">
              <AddArquivos onArquivoCreated={fetchArquivos} />
            </div>
          </SheetTrigger>
        </Sheet>
      </div>

      <div className="overflow-hidden rounded-lg border border-black-200 bg-white">
        {loading ? (
          <div className="p-4">Carregando arquivos...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <DataTable columns={tableColumns} data={data} />
        )}
      </div>
    </div>
  );
};

export default GerenciarBase;