import { useEffect, useState } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppLogin } from "./components/app-login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GerenciarUsuarios from "./pages/users/gerenciar-usuarios";
import { SendHorizontal } from "lucide-react";

type UserRole = "admin" | "user";

function Home({ isLogged }: { isLogged: boolean }) {
  return (
    <main className="flex-1">
      <div className="relative mx-auto min-h-screen w-full max-w-5xl px-8 py-6">
        <div className="pt-16 text-center">
          <h1 className="font-mono text-[56px] font-black leading-[1.15] text-black">
            Bem vindo(a)!
            <br />
            ao CatBot
          </h1>
        </div>

        <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Com o que voce precisa de ajuda?"
              className="h-14 w-full rounded-2xl border border-[#4a90c2] bg-white px-5 pr-16 text-[22px] text-neutral-700 outline-none placeholder:text-neutral-500"
              disabled={!isLogged}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black disabled:opacity-50"
              disabled={!isLogged}
            >
              <SendHorizontal className="h-7 w-7" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [isLogged, setIsLogged] = useState<boolean>(() => {
    return localStorage.getItem("isLogged") === "true";
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem("userRole");
    return savedRole === "admin" ? "admin" : "user";
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("userName") || "Usuário";
  });

  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("isLogged", String(isLogged));
  }, [isLogged]);

  const handleLoginSuccess = (role: UserRole, name: string) => {
    setIsLogged(true);
    setUserRole(role);
    setUserName(name);

    localStorage.setItem("isLogged", "true");
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);

    setLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUserRole("user");
    setUserName("Usuário");

    localStorage.removeItem("isLogged");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#f3f3f3]">
          <AppSidebar
            isLogged={isLogged}
            userRole={userRole}
            userName={userName}
            onOpenLogin={() => setLoginOpen(true)}
            onLogout={handleLogout}
          />

          <Routes>
            <Route path="/" element={<Home isLogged={isLogged} />} />
            <Route
              path="/gerenciar-usuarios"
              element={
                <main className="flex-1">
                  <GerenciarUsuarios />
                </main>
              }
            />
          </Routes>

          <AppLogin
            open={loginOpen}
            onClose={() => setLoginOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </SidebarProvider>
    </BrowserRouter>
  );
}