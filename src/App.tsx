import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { SendHorizonal } from "lucide-react";

export default function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#f3f3f3]">
        <AppSidebar />

        <main className="flex-1">
          <div className="relative mx-auto min-h-screen w-full max-w-5xl px-8 py-6">

            {/* 🔹 TÍTULO (fica acima, independente) */}
            <div className="pt-16 text-center">
              <h1 className="font-mono text-[56px] font-black leading-[1.15] text-black">
                Bem vindo(a)!
                <br />
                ao CatBot
              </h1>
            </div>

            {/* 🔹 INPUT (CENTRO PERFEITO DA TELA) */}
            <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Com o que voce precisa de ajuda?"
                  className="h-14 w-full rounded-2xl border border-[#4a90c2] bg-white px-5 pr-16 text-[22px] text-neutral-700 outline-none placeholder:text-neutral-500"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-black">
                  <SendHorizonal className="h-7 w-7" strokeWidth={1.8} />
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}git add .
git commit -m "add projeto meu-chat"