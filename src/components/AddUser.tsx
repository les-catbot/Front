import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";

const PERFIL_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  padrao: "00000000-0000-0000-0000-000000000002",
} as const;

const inputClassName =
  "h-11 rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm transition-all duration-200 outline-none hover:border-slate-400 focus-visible:border-slate-500 focus-visible:ring-4 focus-visible:ring-slate-200";

const selectClassName =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm transition-all duration-200 outline-none hover:border-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-200";

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do usuário deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do usuário é muito longo!" }),
  email: z.string().email({ message: "Digite um e-mail válido!" }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres!" })
    .max(100, { message: "A senha é muito longa!" }),
  perfil: z.enum(["admin", "padrao"], {
    message: "Selecione um perfil válido!",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type CreateUserResponse = {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  senha_provisoria?: string;
  perfil_id?: string | null;
  criado_em?: string;
  perfil?: {
    id: string;
    nome: string;
  } | null;
};

type AddUserProps = {
  onUserCreated?: () => Promise<void> | void;
};

const AddUser = ({ onUserCreated }: AddUserProps) => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      perfil: "padrao",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setStatus("idle");
      setGeneratedPassword(null);

      const payload = {
        nome: values.nome,
        email: values.email,
        senha: values.senha,
        perfil_id: PERFIL_IDS[values.perfil],
      };

      const response = await fetch("http://localhost:8000/api/v1/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Erro da API:", errorData);
        throw new Error("Erro ao cadastrar o usuário!");
      }

      const data: CreateUserResponse = await response.json();

      setGeneratedPassword(data.senha ?? data.senha_provisoria ?? null);
      setStatus("success");

      await onUserCreated?.();

      form.reset({
        nome: "",
        email: "",
        senha: "",
        perfil: "padrao",
      });

      setSheetOpen(false);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto bg-white px-6 py-8 sm:max-w-md">
        <div className="w-full">
          <SheetHeader className="mb-8 px-0 text-left">
            <SheetTitle className="text-xl font-semibold leading-none tracking-tight">
              Adicionar Novo Usuário
            </SheetTitle>
            <SheetDescription className="pt-1 text-sm text-slate-500">
              Preencha os dados do novo usuário.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-800">
                      Nome completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: João da Silva"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      Insira o nome completo do usuário.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-800">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="exemplo@email.com"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      Insira um e-mail válido.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-800">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Digite a senha"
                        className={inputClassName}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      A senha deve ter pelo menos 6 caracteres.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-800">
                      Perfil
                    </FormLabel>
                    <FormControl>
                      <select
                        className={selectClassName}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <option value="padrao">Usuário Padrão</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      Escolha o perfil de acesso do usuário.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {status === "success" && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <p>Usuário cadastrado com sucesso!</p>
                  {generatedPassword && (
                    <p className="mt-1">
                      <strong>Senha gerada:</strong> {generatedPassword}
                    </p>
                  )}
                </div>
              )}

              {status === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Erro ao cadastrar o usuário!
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="h-11 w-full bg-[#E6EDF2] text-sm font-medium text-slate-800 hover:bg-[#d9e3ea]"
                >
                  Salvar usuário
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddUser;
