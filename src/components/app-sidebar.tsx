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
  Cat,
  LayoutDashboard,
  Database,
  Users,
  User,
  PanelLeftClose,
  MoreHorizontal,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api/v1";

type UserRole = "admin" | "user";

type Conversa = {
  id: string;
  usuario_id: string;
  status_sucesso: boolean;
  iniciado_em: string;
  encerrado_em: string | null;
};

type AppSidebarProps = {
  isLogged: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: UserRole;
  userId?: string | null;
  onSelectConversa?: (conversaId: string) => void;
};

function formatarData(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function AppSidebar({
  isLogged,
  onOpenLogin,
  onLogout,
  userName = "Usuário",
  userRole = "user",
  userId,
  onSelectConversa,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const isAdmin = userRole === "admin";

  const [conversas, setConversas] = useState<Conversa[]>([]);

  useEffect(() => {
    if (!isLogged || !userId) {
      setConversas([]);
      return;
    }

    fetch(`${API_URL}/historico/usuarios/${userId}/conversas`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setConversas(data);
      })
      .catch(() => setConversas([]));
  }, [isLogged, userId]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) toggleSidebar();
  };

  const handleLogoutClick = () => {
    onLogout();
    if (isMobile) toggleSidebar();
    navigate("/");
  };

  const handleSelectConversa = (conversaId: string) => {
    onSelectConversa?.(conversaId);
    handleNavigate("/");
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

      <SidebarContent className="overflow-y-auto px-2 group-data-[collapsible=icon]:px-2">
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

            {isLogged && isAdmin && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/dashboard")}
                    className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  >
                    <LayoutDashboard className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="truncate">Dashboard</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/gerenciar-base")}
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

        {!isCollapsed && isLogged && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-3 text-xs font-medium text-zinc-500">
              Seus chats
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 space-y-1">
              {conversas.length === 0 ? (
                <p className="px-3 text-xs text-zinc-400">Nenhuma conversa ainda.</p>
              ) : (
                conversas.map((conversa) => (
                  <SidebarMenuItem key={conversa.id}>
                    <SidebarMenuButton
                      onClick={() => handleSelectConversa(conversa.id)}
                      className="h-10 rounded-xl px-3 hover:bg-white/70"
                    >
                      <MessageSquare className="h-5 w-5 shrink-0" />
                      <span className="truncate">
                        Chat de {formatarData(conversa.iniciado_em)}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {isLogged ? (
              <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 hover:bg-white/70">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <User className="h-5 w-5 text-zinc-700" />
                  </div>

                  {!isCollapsed && (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-zinc-500">
                        {isAdmin ? "Administrador" : "Usuário"}
                      </p>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-600 hover:bg-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={handleLogoutClick}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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