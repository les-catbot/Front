import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
} from "./ui/sidebar";

import { Plus, Search, MessageSquare, LogIn, Cat } from "lucide-react";
import { AppLogin } from "./app-login";

const chats = [
  "Ideias para projeto",
  "Planejamento da semana",
  "Layout do app",
  "Tela de login",
];



export function AppSidebar() {
  const [openLogin, setOpenLogin] = useState(false);
  return (
    <Sidebar className="w-[260px] border-r border-zinc-300 bg-[#E6EDF1] text-zinc-900">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
            <Cat className="h-5 w-5 text-zinc-800" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">CatBOT</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-xl px-3 hover:bg-white/70">
                <Plus className="h-4 w-4" />
                <button>Novo chat</button>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton className="h-10 rounded-xl px-3 hover:bg-white/70">
                <Search className="h-4 w-4" />
                <span>Procurar um chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-xs font-medium text-zinc-500">
            Seus chats
          </SidebarGroupLabel>

          <SidebarMenu className="mt-2 space-y-1">
            {chats.map((chat) => (
              <SidebarMenuItem key={chat}>
                <SidebarMenuButton className="h-10 rounded-xl px-3 hover:bg-white/70">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{chat}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10 rounded-xl px-3 hover:bg-white/70">
              <LogIn className="h-4 w-4" />
               <button onClick={() => setOpenLogin(true)}>Login</button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <AppLogin open={openLogin} onClose={() => setOpenLogin(false)} />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
