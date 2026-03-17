import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";

const PRIMARY = "#457B9D";

type AppLoginProps = {
  open: boolean;
  onClose: () => void;
};

function SocialButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 w-full rounded-md border border-zinc-300 bg-white text-sm font-medium text-zinc-800 shadow-none hover:bg-zinc-50"
    >
      {children}
    </Button>
  );
}

export function AppLogin({ open, onClose }: AppLoginProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <Card className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] bg-white">
        <div className="grid min-h-[520px] grid-cols-1 md:grid-cols-2">
          <CardContent className="flex h-full flex-col justify-center px-8 py-10 md:px-10 md:py-12">
            <div className="mx-auto w-full max-w-[330px]">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900">
                Bem vindo(a) de volta!
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-800">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Digite seu email"
                    className="h-11 rounded-xl border-zinc-300 bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-800">
                    Senha
                  </label>
                  <Input
                    type="password"
                    placeholder="Digite sua senha"
                    className="h-11 rounded-xl border-zinc-300 bg-white"
                  />
                </div>
              </div>

              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-xs font-medium text-zinc-500 transition hover:text-zinc-800"
                >
                  Esqueceu senha?
                </button>
              </div>

              <Button
                type="button"
                className="mt-6 h-11 w-full rounded-xl text-base font-semibold text-white hover:opacity-95"
                style={{ backgroundColor: PRIMARY }}
              >
                Login
              </Button>

              <div className="my-6 h-px w-full bg-zinc-200" />

              <div className="grid grid-cols-2 gap-3">
                <SocialButton>Sign in with Google</SocialButton>
                <SocialButton>Sign in with Apple</SocialButton>
              </div>
            </div>
          </CardContent>

          <div
            className="relative flex h-full flex-col justify-center px-8 py-10 text-white md:px-10 md:py-12"
            style={{ backgroundColor: PRIMARY }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"
            >
              <X size={16} />
            </button>

            <div className="mx-auto w-full max-w-[330px]">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-white">
                Bem vindo(a)!
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/95">
                    Nome
                  </label>
                  <Input
                    placeholder="Nome"
                    className="h-11 rounded-xl border-white/70 bg-transparent text-white placeholder:text-white/65"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/95">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="h-11 rounded-xl border-white/70 bg-transparent text-white placeholder:text-white/65"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/95">
                    Senha
                  </label>
                  <Input
                    type="password"
                    placeholder="Senha"
                    className="h-11 rounded-xl border-white/70 bg-transparent text-white placeholder:text-white/65"
                  />
                </div>
              </div>

              <p className="mt-5 text-sm text-white/85">
                O login é feito de forma segura
              </p>

              <Button
                type="button"
                className="mt-6 h-11 w-full rounded-xl bg-white text-base font-semibold text-zinc-900 hover:bg-white/95"
              >
                Signup
              </Button>

              <div className="my-6 h-px w-full bg-white/20" />

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-md border-white/60 bg-transparent text-sm font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  Sign in with Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-md border-white/60 bg-transparent text-sm font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  Sign in with Apple
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}