import { useEffect, useState } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppLogin } from "./components/app-login";
import { AppChat } from "./components/app-chat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GerenciarUsuarios from "./pages/users/gerenciar-usuarios";
import GerenciarBase from "./pages/baseDados/gerenciar-page";
import Dashboard from "./pages/dashboard/dashboard";

type UserRole = "admin" | "user";

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

  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId");
  });

  const [conversaId, setConversaId] = useState<string | null>(null);

  // chatKey só muda ao clicar em "Novo chat" — não ao navegar entre rotas
  const [chatKey, setChatKey] = useState(0);

  // Incrementado toda vez que uma nova conversa é criada, para a sidebar rebuscar o histórico
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("isLogged", String(isLogged));
  }, [isLogged]);

  const handleLoginSuccess = (role: UserRole, name: string, id?: string) => {
    setIsLogged(true);
    setUserRole(role);
    setUserName(name);
    setConversaId(null);

    localStorage.setItem("isLogged", "true");
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);

    if (id) {
      setUserId(id);
      localStorage.setItem("userId", id);
    }

    setLoginOpen(false);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUserRole("user");
    setUserName("Usuário");
    setUserId(null);
    setConversaId(null);

    localStorage.removeItem("isLogged");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
  };

  // Reseta o chat: limpa a conversa e força remontagem do AppChat
  const handleNewChat = () => {
    setConversaId(null);
    setChatKey((k) => k + 1);
  };

  // Chamado pelo AppChat quando uma nova conversa é criada no backend
  const handleConversaCriada = () => {
    setSidebarRefreshKey((k) => k + 1);
  };

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#f3f3f3]">
          <AppSidebar
            isLogged={isLogged}
            userRole={userRole}
            userName={userName}
            userId={userId}
            refreshKey={sidebarRefreshKey}
            onOpenLogin={() => setLoginOpen(true)}
            onLogout={handleLogout}
            onSelectConversa={(id) => setConversaId(id)}
            onNewChat={handleNewChat}
          />

          <Routes>
            <Route
              path="/"
              element={
                <AppChat
                  key={chatKey}
                  isLogged={isLogged}
                  userId={userId}
                  conversaId={conversaId}
                  onConversaIdChange={setConversaId}
                  onConversaCriada={handleConversaCriada}
                />
              }
            />
            <Route
              path="/gerenciar-usuarios"
              element={
                <main className="flex-1">
                  <GerenciarUsuarios />
                </main>
              }
            />
            <Route
              path="/gerenciar-base"
              element={
                <main className="flex-1">
                  <GerenciarBase />
                </main>
              }
            />
            <Route
              path="/dashboard"
              element={
                <main className="flex-1">
                  <Dashboard />
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