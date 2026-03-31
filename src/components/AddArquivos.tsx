"use client";

import { useRef, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Plus, Upload, FileText } from "lucide-react";

type AddArquivosProps = {
  onArquivoCreated?: () => Promise<void> | void;
  children?: React.ReactNode;
};

const detectarCategoria = (file: File) => {
  const nome = file.name.toLowerCase();

  if (nome.includes("contrato")) return "Contratos";
  if (nome.includes("nota")) return "Notas";
  if (nome.includes("relatorio") || nome.includes("relatório"))
    return "Relatórios";
  if (nome.includes("certidao") || nome.includes("certidão"))
    return "Certidões";

  if (file.type.includes("pdf")) return "PDF";
  if (file.type.includes("image")) return "Imagem";
  if (
    file.type.includes("word") ||
    file.name.endsWith(".doc") ||
    file.name.endsWith(".docx")
  ) {
    return "Documento Word";
  }

  return "Geral";
};

const AddArquivos = ({
  onArquivoCreated,
  children,
}: AddArquivosProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fonte, setFonte] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setTitulo("");
    setCategoria("");
    setFonte("");
    setConteudo("");
    setArquivo(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArquivo(file);

    if (!file) return;

    const nomeSemExtensao = file.name.replace(/\.[^/.]+$/, "");

    setTitulo(nomeSemExtensao);
    setCategoria(detectarCategoria(file));
  };

  const onSubmit = async () => {
    if (!titulo.trim()) {
      alert("Preencha o título.");
      return;
    }

    if (!categoria.trim()) {
      alert("Preencha a categoria.");
      return;
    }

    if (!fonte.trim()) {
      alert("Preencha a fonte.");
      return;
    }

    if (!arquivo) {
      alert("Selecione um documento.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("titulo", titulo.trim());
      formData.append("categoria", categoria.trim());
      formData.append("fonte", fonte.trim());

      if (conteudo.trim()) {
        formData.append("conteudo", conteudo.trim());
      }

      formData.append("arquivo", arquivo);

      const response = await fetch("http://localhost:8000/api/v1/documentos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o documento!");
      }

      alert("Documento cadastrado com sucesso!");

      setOpen(false);
      resetForm();

      await onArquivoCreated?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar o documento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Novo Documento
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="overflow-y-auto border-white/20 bg-white/75 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="mb-4">Adicionar Documento</SheetTitle>

          <SheetDescription asChild>
            <div className="space-y-6">
              {/* DOCUMENTO AGORA FICA NO TOPO */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Documento
                </label>

                <label
                  htmlFor="documento-upload"
                  className="
                    flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2
                    rounded-xl border border-dashed border-[#457B9D]/40
                    bg-white/70 px-4 text-center backdrop-blur-sm
                    transition-all duration-200
                    hover:border-[#457B9D] hover:bg-white/90
                  "
                >
                  <Upload className="h-6 w-6 text-[#457B9D]" />

                  <span className="text-sm font-semibold text-foreground">
                    Escolher documento
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Clique aqui para selecionar um arquivo do computador
                  </span>

                  <input
                    id="documento-upload"
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <p className="text-sm text-muted-foreground">
                  O envio do documento é obrigatório.
                </p>

                {arquivo && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#457B9D]/20 bg-white/60 px-3 py-3 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 text-[#457B9D]" />
                    <span>
                      Documento selecionado:{" "}
                      <span className="font-medium text-foreground">
                        {arquivo.name}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="titulo" className="text-sm font-medium leading-none">
                  Título
                </label>
                <input
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Digite o título"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="categoria"
                  className="text-sm font-medium leading-none"
                >
                  Categoria
                </label>
                <input
                  id="categoria"
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Digite a categoria"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="fonte" className="text-sm font-medium leading-none">
                  Fonte
                </label>
                <input
                  id="fonte"
                  type="text"
                  value={fonte}
                  onChange={(e) => setFonte(e.target.value)}
                  placeholder="Digite a fonte"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="conteudo"
                  className="text-sm font-medium leading-none"
                >
                  Conteúdo
                </label>
                <textarea
                  id="conteudo"
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  placeholder="Digite o conteúdo (opcional)"
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={loading}
                  className="bg-[#457B9D] font-medium text-white hover:bg-[#457BAD]"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Documento"}
                </Button>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AddArquivos;