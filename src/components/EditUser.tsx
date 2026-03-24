"use client";

import { useEffect, useState } from "react";
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
import { Pencil } from "lucide-react";

const PERFIL_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  padrao: "00000000-0000-0000-0000-000000000002",
} as const;

const PERFIL_LABEL_BY_ID: Record<string, "admin" | "padrao"> = {
  [PERFIL_IDS.admin]: "admin",
  [PERFIL_IDS.padrao]: "padrao",
};

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do usuário deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do usuário é muito longo!" }),
  email: z.string().email({ message: "Digite um e-mail válido!" }),
  senha: z.string().optional().or(z.literal("")),
  perfil: z.enum(["admin", "padrao"], {
    message: "Selecione um perfil válido!",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type UserResponse = {
  id: string;
  nome: string;
  email: string;
  perfil_id?: string | null;
  perfil?: {
    id: string;
    nome: string;
  } | null;
};

interface EditUserProps {
  user: {
    id: string;
  };
  onUserUpdated?: () => void;
  children?: React.ReactNode;
}

const EditUser = ({ user, onUserUpdated, children }: EditUserProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      perfil: "padrao",
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      if (!open || !user.id) return;

      try {
        setLoadingUser(true);

        const response = await fetch(
          `http://localhost:8000/api/v1/usuarios/${user.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar usuário!");
        }

        const data: UserResponse = await response.json();

        const perfil =
          (data.perfil_id && PERFIL_LABEL_BY_ID[data.perfil_id]) ||
          (data.perfil?.id && PERFIL_LABEL_BY_ID[data.perfil.id]) ||
          "padrao";

        form.reset({
          nome: data.nome ?? "",
          email: data.email ?? "",
          senha: "",
          perfil,
        });
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar os dados do usuário.");
      } finally {
        setLoadingUser(false);
      }
    };

    loadUser();
  }, [open, user.id, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        nome: values.nome,
        email: values.email,
        perfil_id: PERFIL_IDS[values.perfil],
        ...(values.senha ? { senha: values.senha } : {}),
      };

      const response = await fetch(
        `http://localhost:8000/api/v1/usuarios/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao editar o usuário!");
      }

      alert("Usuário atualizado com sucesso!");
      setOpen(false);
      onUserUpdated?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alterações do usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Pencil className="h-4 w-4" />
            Editar Usuário
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="mb-4">Editar Usuário</SheetTitle>

          <SheetDescription asChild>
            <>
              {loadingUser ? (
                <div className="py-4 text-sm text-muted-foreground">
                  Carregando dados do usuário...
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Usuário</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite o nome do usuário"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Edite o nome completo do usuário.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Digite o e-mail"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Edite o e-mail do usuário.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Digite uma nova senha"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em branco para manter a senha atual.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="perfil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Perfil</FormLabel>
                          <FormControl>
                            <select
                              value={field.value}
                              onChange={field.onChange}
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="padrao">Usuário Padrão</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Escolha o perfil do usuário.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar Alterações"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default EditUser;