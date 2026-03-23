import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";

const PRIMARY = "#457B9D";

type AppLoginProps = {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
};

export function AppLogin({
  open,
  onClose,
  onLoginSuccess,
}: AppLoginProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleLogin = () => {
    if (user === "adm" && password === "123") {
      setError("");
      onLoginSuccess();
      return;
    }

    setError("Usuário ou senha inválidos.");
  };

  const handleForgotPassword = () => {
    alert("Usuário: adm | Senha: 123");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <Card className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] bg-white">
        <CardContent className="relative px-8 py-10 md:px-10 md:py-12">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white transition hover:bg-zinc-100"
          >
            <X size={16} />
          </button>

          <div className="mx-auto w-full max-w-[330px]">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900">
              Bem-vindo de volta!
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-800">
                  Usuário
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu usuário"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-zinc-300 bg-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />
              </div>
            </div>

            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-medium text-zinc-500 transition hover:text-zinc-800"
              >
                Esqueceu a senha?
              </button>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}

            <Button
              type="button"
              onClick={handleLogin}
              className="mt-6 h-11 w-full rounded-xl text-base font-semibold text-white hover:opacity-95"
              style={{ backgroundColor: PRIMARY }}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}