import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { X, Eye, EyeOff } from "lucide-react";

const PRIMARY = "#457B9D";

type UserRole = "admin" | "user";

const PERFIS: Record<string, UserRole> = {
  "00000000-0000-0000-0000-000000000001": "admin",
  "00000000-0000-0000-0000-000000000002": "user",
};

type AppLoginProps = {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, name: string, id?: string) => void;
};

function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function AppLogin({ open, onClose, onLoginSuccess }: AppLoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setError("Email ou senha estão incorretos.");
        return;
      }

      const data = await response.json();
      const token = data?.token || data?.access_token || data?.jwt;

      if (!token) {
        setError("Token não retornado pela API.");
        return;
      }

      localStorage.setItem("token", token);

      const payload = parseJwt(token);
      console.log("Payload do token:", payload);

      // extrai o ID do usuário — tenta os campos mais comuns
      const userId: string | undefined =
        payload?.sub ||
        payload?.id ||
        payload?.usuario_id ||
        payload?.user_id ||
        data?.usuario_id ||
        data?.id ||
        undefined;

      const perfilId = payload?.perfil_id || payload?.profile_id || payload?.id_perfil;
      const perfilNome = payload?.perfil || payload?.role || payload?.tipo_perfil;
      const nomeUsuario =
        payload?.nome || payload?.name || payload?.username || payload?.email || email;

      let userRole: UserRole = "user";
      if (typeof perfilId === "string" && PERFIS[perfilId]) {
        userRole = PERFIS[perfilId];
      } else if (
        perfilNome === "Administrador" ||
        perfilNome === "admin" ||
        perfilNome === "ADMIN"
      ) {
        userRole = "admin";
      }

      if (userId) localStorage.setItem("userId", userId);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", nomeUsuario);
      localStorage.setItem("isLogged", "true");

      onLoginSuccess(userRole, nomeUsuario, userId);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Email ou senha estão incorretos.");
    } finally {
      setLoading(false);
    }
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
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-800">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-11 rounded-xl border-zinc-300 bg-white pr-12"
                    onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
                  >
                    {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}

            <Button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="mt-6 h-11 w-full rounded-xl text-base font-semibold text-white hover:opacity-95 disabled:opacity-70"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? "Entrando..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}