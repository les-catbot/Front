"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { FileText, Pencil, Upload } from "lucide-react";

const formSchema = z.object({
  titulo: z.string(),
  categoria: z.string(),
  fonte: z
    .string()
    .min(2, { message: "A fonte deve ter pelo menos 2 caracteres!" })
    .max(150, { message: "A fonte está muito longa!" }),
  conteudo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type DocumentoData = {
  id: string;
  titulo: string;
  categoria: string;
  fonte: string;
  conteudo?: string | null;
  arquivo_url?: string | null;
  arquivo_nome?: string | null;
  versao?: number | null;
};

type EditArquivosProps = {
  documento: DocumentoData;
  onArquivoUpdated?: (id: string) => Promise<void> | void;
  children?: React.ReactNode;
};

const EditArquivos = ({
  documento,
  onArquivoUpdated,
  children,
}: EditArquivosProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: documento?.titulo || "",
      categoria: documento?.categoria || "",
      fonte: documento?.fonte || "",
      conteudo: documento?.conteudo || "",
    },
  });

  const resetForm = () => {
    form.reset({
      titulo: documento?.titulo || "",
      categoria: documento?.categoria || "",
      fonte: documento?.fonte || "",
      conteudo: documento?.conteudo || "",
    });

    setArquivo(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (open) {
      form.reset({
        titulo: documento?.titulo || "",
        categoria: documento?.categoria || "",
        fonte: documento?.fonte || "",
        conteudo: documento?.conteudo || "",
      });

      setArquivo(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [open, documento, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setArquivo(file);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("conteudo", values.conteudo?.trim() || "");

      if (arquivo) {
        formData.append("arquivo", arquivo);
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/documentos/${documento.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      console.log("STATUS:", response.status);
      console.log("RESPOSTA API:", data);

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Erro ao editar o documento!"
        );
      }

      alert("Documento atualizado com sucesso!");

      await onArquivoUpdated?.(documento.id);

      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("ERRO AO ATUALIZAR:", error);
      alert(error?.message || "Erro ao atualizar o documento.");
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
            <Pencil className="h-4 w-4" />
            Editar Documento
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="overflow-y-auto border-white/20 bg-white/75 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="mb-4">Editar Documento</SheetTitle>

          <SheetDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      Trocar documento
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Clique aqui para selecionar um novo arquivo (opcional)
                    </span>

                    <input
                      id="documento-upload"
                      ref={inputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  {!arquivo && documento.arquivo_nome && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#457B9D]/20 bg-white/60 px-3 py-3 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 text-[#457B9D]" />
                      <span>
                        Documento atual:{" "}
                        <span className="font-medium text-foreground">
                          {documento.arquivo_nome}
                        </span>
                      </span>
                    </div>
                  )}

                  {arquivo && (
                    <div className="flex items-center gap-2 rounded-lg border border-[#457B9D]/20 bg-white/60 px-3 py-3 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 text-[#457B9D]" />
                      <span>
                        Novo documento selecionado:{" "}
                        <span className="font-medium text-foreground">
                          {arquivo.name}
                        </span>
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    Envie um novo arquivo apenas se quiser substituir o atual.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="cursor-not-allowed bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        O título não pode ser alterado.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled
                          className="cursor-not-allowed bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        A categoria não pode ser alterada.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fonte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite a fonte"
                          className="bg-white/70 border border-input backdrop-blur-sm transition-all duration-200 hover:border-[#457B9D]/60 focus-visible:border-[#457B9D] focus-visible:ring-2 focus-visible:ring-[#457B9D]/30"
                        />
                      </FormControl>
                      <FormDescription>
                        Campo visual apenas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conteudo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conteúdo</FormLabel>
                      <FormControl>
                        <textarea
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Digite o conteúdo (opcional)"
                          className="min-h-[120px] w-full rounded-md border border-input bg-white/70 px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-[#457B9D]/60 focus-visible:border-[#457B9D] focus-visible:ring-2 focus-visible:ring-[#457B9D]/30"
                        />
                      </FormControl>
                      <FormDescription>
                        Campo opcional para descrição ou observações.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#457B9D] font-medium text-white hover:bg-[#457BAD]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default EditArquivos;