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
  X,
  CalendarSearch,
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
  onNewChat?: () => void; // callback para resetar o chat na página pai
};

function formatarData(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

// Formata para o input date (YYYY-MM-DD)
function toInputDate(iso: string) {
  return iso.slice(0, 10);
}

export function AppSidebar({
  isLogged,
  onOpenLogin,
  onLogout,
  userName = "Usuário",
  userRole = "user",
  userId,
  onSelectConversa,
  onNewChat,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const isAdmin = userRole === "admin";

  const [conversas, setConversas] = useState<Conversa[]>([]);

  // Estado do modal de pesquisa por período
  const [searchOpen, setSearchOpen] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [searchResults, setSearchResults] = useState<Conversa[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Carrega histórico completo
  const fetchConversas = () => {
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
  };

  useEffect(() => {
    fetchConversas();
  }, [isLogged, userId]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) toggleSidebar();
  };

  // Novo chat: reseta o estado e navega para "/"
  const handleNewChat = () => {
    onNewChat?.();
    handleNavigate("/");
  };

  const handleLogoutClick = () => {
    onLogout();
    if (isMobile) toggleSidebar();
    navigate("/");
  };

  const handleSelectConversa = (conversaId: string) => {
    onSelectConversa?.(conversaId);
    setSearchOpen(false);
    setSearchResults(null);
    handleNavigate("/");
  };

  // Pesquisa por período
  const handleSearch = async () => {
    if (!userId) return;
    setIsSearching(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const params = new URLSearchParams();
      if (dataInicio) params.append("data_inicio", dataInicio);
      if (dataFim) params.append("data_fim", dataFim);

      const res = await fetch(
        `${API_URL}/historico/usuarios/${userId}/conversas/filtrar?${params.toString()}`
      );

      if (!res.ok) throw new Error("Erro na pesquisa");

      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch {
      setSearchError("Não foi possível buscar as conversas.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchOpen(false);
    setSearchResults(null);
    setDataInicio("");
    setDataFim("");
    setSearchError("");
  };

  // Lista a exibir no histórico (resultado filtrado ou lista completa)
  const listaExibida = searchResults ?? conversas;

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
            {/* Novo Chat */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleNewChat}
                className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <Plus className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">Novo chat</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Procurar chat por período */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {
                  if (!isCollapsed) setSearchOpen((prev) => !prev);
                }}
                className={`h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                  searchOpen ? "bg-white/80" : ""
                }`}
              >
                <Search className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">Procurar um chat</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Painel de pesquisa por período */}
            {!isCollapsed && searchOpen && isLogged && (
              <div className="mx-1 mb-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                    <CalendarSearch className="h-3.5 w-3.5" />
                    Filtrar por período
                  </span>
                  <button
                    onClick={handleClearSearch}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="mb-0.5 block text-[10px] text-zinc-500">
                      De
                    </label>
                    <input
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-700 outline-none focus:border-[#4a90c2]"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-[10px] text-zinc-500">
                      Até
                    </label>
                    <input
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-700 outline-none focus:border-[#4a90c2]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isSearching || (!dataInicio && !dataFim)}
                  className="mt-3 w-full rounded-lg bg-[#4a90c2] py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </button>

                {searchError && (
                  <p className="mt-2 text-[10px] text-red-500">{searchError}</p>
                )}

                {searchResults !== null && (
                  <p className="mt-2 text-[10px] text-zinc-400">
                    {searchResults.length === 0
                      ? "Nenhuma conversa encontrada."
                      : `${searchResults.length} conversa(s) encontrada(s)`}
                  </p>
                )}
              </div>
            )}

            {/* Admin links */}
            {isLogged && isAdmin && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigate("/dashboard")}
                    className="h-10 rounded-xl px-3 hover:bg-white/70 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                  >
                    <LayoutDashboard className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate">Dashboard</span>
                    )}
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

        {/* Histórico de conversas */}
        {!isCollapsed && isLogged && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="flex items-center justify-between px-3 text-xs font-medium text-zinc-500">
              <span>
                {searchResults !== null ? "Resultados da busca" : "Seus chats"}
              </span>
              {searchResults !== null && (
                <button
                  onClick={handleClearSearch}
                  className="text-[10px] text-[#4a90c2] hover:underline"
                >
                  ver todos
                </button>
              )}
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 space-y-1">
              {listaExibida.length === 0 ? (
                <p className="px-3 text-xs text-zinc-400">
                  {searchResults !== null
                    ? "Nenhuma conversa no período."
                    : "Nenhuma conversa ainda."}
                </p>
              ) : (
                listaExibida.map((conversa) => (
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