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
import { useEffect, useState } from "react";
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

const formSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome do usuário deve ter pelo menos 2 caracteres!" })
    .max(100, { message: "O nome do usuário é muito longo!" }),
  email: z.string().email({ message: "Digite um e-mail válido!" }),
  username: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// 🔥 função pra gerar username
const gerarUsername = (nomeCompleto: string) => {
  return nomeCompleto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");
};

const AddUser = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [sheetOpen, setSheetOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      username: "",
    },
  });

  // 👀 observa o nome
  const nomeValue = form.watch("nome");

  // 🔄 atualiza username automaticamente
  useEffect(() => {
    const usernameGerado = gerarUsername(nomeValue || "");
    form.setValue("username", usernameGerado);
  }, [nomeValue, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("http://localhost:8080/api/atores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar o usuário!");
      }

      await response.json();

      form.reset();
      setStatus("success");
      setSheetOpen(false);

      window.location.reload();
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

      <SheetContent className="overflow-y-auto bg-white/90 backdrop-blur-md px-6 py-8">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl font-semibold">
            Adicionar Novo Usuário
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Preencha os dados do novo usuário.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* NOME */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Nome completo
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: João da Silva"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Insira o nome completo do usuário.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="exemplo@email.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Insira um e-mail válido.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* USERNAME */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="h-11 bg-muted/60 text-muted-foreground cursor-not-allowed"
                        placeholder="Gerado automaticamente"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Gerado automaticamente a partir do nome (sem espaços,
                      acentos ou letras maiúsculas).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BOTÃO */}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium bg-[#E6EDF2]"
                >
                  Salvar usuário
                </Button>
              </div>

              {/* FEEDBACK */}
              {status === "success" && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                  Usuário cadastrado com sucesso!
                </div>
              )}

              {status === "error" && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  Erro ao cadastrar o usuário!
                </div>
              )}
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddUser;
