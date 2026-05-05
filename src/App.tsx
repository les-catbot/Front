import { useEffect, useState } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppLogin } from "./components/app-login";
import { AppChat } from "./components/app-chat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GerenciarUsuarios from "./pages/users/gerenciar-usuarios";
import GerenciarBase from "./pages/baseDados/gerenciar-page";

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
  // chatKey força o AppChat a remontar (reset completo) ao iniciar novo chat
  const [chatKey, setChatKey] = useState(0);

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

  return (
    <BrowserRouter>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-[#f3f3f3]">
          <AppSidebar
            isLogged={isLogged}
            userRole={userRole}
            userName={userName}
            userId={userId}
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