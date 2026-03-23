"use client";

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
  useSidebar,
} from "./ui/sidebar";

import {
  Plus,
  Search,
  MessageSquare,
  LogIn,
  LogOut,
  Cat,
  LayoutDashboard,
  Database,
  Users,
  User,
  PanelLeftClose,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type AppSidebarProps = {
  isLogged: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
};

const chats = [
  "Ideias para projeto",
  "Planejamento da semana",
  "Layout do app",
  "Tela de login",
];

export function AppSidebar({
  isLogged,
  onOpenLogin,
  onLogout,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, state } = useSidebar();

  const isCollapsed = state === "collapsed";

  const handleNavigate = (path: string) => {
    navigate(path);

    if (isMobile) {
      toggleSidebar();
    }
  };

  const handleLogoutClick = () => {
    onLogout();

    if (isMobile) {
      toggleSidebar();
    }

    navigate("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      onClick={() => {
        if (isCollapsed) toggleSidebar();
      }}
      className="border-r border-zinc-300 bg-[#E6EDF1] text-zinc-900 [--sidebar-width-icon:4.5rem]"
    >
      <SidebarHeader className="px-3 py-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
              <Cat className="h-5 w-5 text-zinc-800" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">CatBOT</p>
                <p className="truncate text-xs text-zinc-500">Seu assistente</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleSidebar();
              }}
              className="shrink-0"
            >
              <PanelLeftClose className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 overflow-y-auto group-data-[collapsible=icon]:px-2">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigate("/")}
                className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <Plus className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Novo chat</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => handleNavigate("/")}
                className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <Search className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Procurar um chat</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {isLogged && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/")}
                    className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  >
                    <LayoutDashboard className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">Dashboard</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/")}
                    className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  >
                    <Database className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">Gerenciar base de dados</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/gerenciar-usuarios")}
                    className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  >
                    <Users className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">Gerenciar usuários</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-xs font-medium text-zinc-500">
              Seus chats
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 space-y-1">
              {chats.map((chat) => (
                <SidebarMenuItem key={chat}>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/")}
                    className="h-10 rounded-xl px-3 hover:bg-white/70"
                  >
                    <MessageSquare className="h-5 w-5 shrink-0" />
                    <span className="truncate">{chat}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {isLogged ? (
              <SidebarMenuButton
                onClick={handleLogoutClick}
                className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Sair</span>}
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                onClick={onOpenLogin}
                className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <LogIn className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Login</span>}
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}