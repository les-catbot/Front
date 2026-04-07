import { useEffect, useState } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppLogin } from "./components/app-login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GerenciarUsuarios from "./pages/users/gerenciar-usuarios";
import { SendHorizontal } from "lucide-react";
import GerenciarBase from "./pages/baseDados/gerenciar-page";

type UserRole = "admin" | "user";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

function Home({ isLogged }: { isLogged: boolean }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);

  const hasMessages = messages.length > 0;

  const handleSendMessage = async () => {
    const text = inputValue.trim();

    if (!text || !isLogged || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "Recebi sua mensagem. Por enquanto, a integração com respostas ainda não está pronta.",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsSending(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <main className="flex-1">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-8 py-6">
        {!hasMessages ? (
          <>
            <div className="pt-16 text-center">
              <h1 className="font-mono text-[56px] font-black leading-[1.15] text-black">
                Bem vindo(a)!
                <br />
                ao CatBot
              </h1>
            </div>

            <div className="flex flex-1 items-center justify-center px-4">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Com o que você precisa de ajuda?"
                  className="h-14 w-full rounded-2xl border border-[#4a90c2] bg-white px-5 pr-16 text-[22px] text-neutral-700 outline-none placeholder:text-neutral-500"
                  disabled={!isLogged || isSending}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black disabled:opacity-50"
                  disabled={!isLogged || isSending || !inputValue.trim()}
                >
                  <SendHorizontal className="h-7 w-7" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex-1 space-y-4 overflow-y-auto pt-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-[#4a90c2] text-white"
                        : "bg-white text-neutral-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] rounded-2xl bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm">
                    Digitando...
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#f3f3f3] pb-4 pt-2">
              <div className="relative w-full">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Com o que você precisa de ajuda?"
                  className="h-14 w-full rounded-2xl border border-[#4a90c2] bg-white px-5 pr-16 text-[18px] text-neutral-700 outline-none placeholder:text-neutral-500"
                  disabled={!isLogged || isSending}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black disabled:opacity-50"
                  disabled={!isLogged || isSending || !inputValue.trim()}
                >
                  <SendHorizontal className="h-6 w-6" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </>
        )}
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