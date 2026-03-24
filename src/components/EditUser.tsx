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
import { Eye, EyeOff, Pencil } from "lucide-react";

const PERFIL_IDS = {
  admin: "00000000-0000-0000-0000-000000000001",
  padrao: "00000000-0000-0000-0000-000000000002",
} as const;

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do usuário deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do usuário é muito longo!" }),
  email: z.string().email({ message: "Digite um e-mail válido!" }),
  senha: z
    .string()
    .optional()
    .or(z.literal("")),
  perfil: z.enum(["admin", "padrao"], {
    message: "Selecione um perfil válido!",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type UserData = {
  id: string;
  nome: string;
  email: string;
  perfil_id?: string | null;
};

type EditUserProps = {
  user: UserData;
  onUserUpdated?: () => Promise<void> | void;
  children?: React.ReactNode;
};

const EditUser = ({ user, onUserUpdated, children }: EditUserProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPerfilValue = (perfil_id?: string | null): "admin" | "padrao" => {
    if (perfil_id === PERFIL_IDS.admin) return "admin";
    return "padrao";
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: user.nome || "",
      email: user.email || "",
      senha: "",
      perfil: getPerfilValue(user.perfil_id),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nome: user.nome || "",
        email: user.email || "",
        senha: "",
        perfil: getPerfilValue(user.perfil_id),
      });
      setShowPassword(false);
    }
  }, [open, user, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload: Record<string, string> = {
        nome: values.nome,
        email: values.email,
        perfil_id: PERFIL_IDS[values.perfil],
      };

      if (values.senha?.trim()) {
        payload.senha = values.senha;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/usuarios/${user.id}`,
        {
          method: "PUT", // ou PATCH, se sua API usar PATCH
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao editar o usuário!");
      }

      alert("Usuário atualizado com sucesso!");

      setOpen(false);
      setShowPassword(false);

      form.reset({
        nome: user.nome || "",
        email: user.email || "",
        senha: "",
        perfil: getPerfilValue(user.perfil_id),
      });

      await onUserUpdated?.();
    } catch (error) {
      console.error(error);
      alert("Erro ao editar o usuário.");
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
          setShowPassword(false);
          form.reset({
            nome: user.nome || "",
            email: user.email || "",
            senha: "",
            perfil: getPerfilValue(user.perfil_id),
          });
        }
      }}
    >
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Pencil className="h-4 w-4" />
            Editar Usuário
          </Button>
        )}
      </SheetTrigger>

      <SheetContent className="overflow-y-auto border-white/20 bg-white/75 backdrop-blur-md">
        <SheetHeader>
          <SheetTitle className="mb-4">Editar Usuário</SheetTitle>

          <SheetDescription asChild>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Usuário</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/70 backdrop-blur-sm border border-input transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#457B9D]/30 focus-visible:border-[#457B9D] hover:border-[#457B9D]/60"
                          placeholder="Digite o nome do usuário"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/70 backdrop-blur-sm border border-input transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#457B9D]/30 focus-visible:border-[#457B9D] hover:border-[#457B9D]/60"
                          type="email"
                          placeholder="Digite o e-mail"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite a nova senha (opcional)"
                            {...field}
                            className="pr-10 bg-white/70 backdrop-blur-sm border border-input transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#457B9D]/30 focus-visible:border-[#457B9D] hover:border-[#457B9D]/60"
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            aria-label={
                              showPassword ? "Ocultar senha" : "Mostrar senha"
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Preencha apenas se quiser alterar a senha.
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
                          className="flex h-10 w-full rounded-md border border-input bg-white/70 px-3 py-2 text-sm backdrop-blur-sm"
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
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#457B9D] text-white font-medium hover:bg-[#457BAD]"
                  >
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

export default EditUser;