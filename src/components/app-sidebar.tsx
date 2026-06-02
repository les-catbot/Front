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
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

const API_URL = "http://localhost:8000/api/v1";

type UserRole = "admin" | "user";

type Mensagem = {
  id: string;
  conversa_id: string;
  conteudo: string;
  tipo_remetente: "usuario" | "bot";
  status_validacao: string;
  criado_em: string;
};

type Conversa = {
  id: string;
  usuario_id: string;
  status_sucesso: boolean;
  iniciado_em: string;
  encerrado_em: string | null;
  preview?: string;
  loading?: boolean;
  mensagens?: Mensagem[]; // Armazenar mensagens para busca
};

type AppSidebarProps = {
  isLogged: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: UserRole;
  userId?: string | null;
  refreshKey?: number;
  onSelectConversa?: (conversaId: string) => void;
  onNewChat?: () => void;
};

// Cache para dados completos das conversas
const conversasCache = new Map<string, { preview: string; mensagens: Mensagem[] }>();

function formatarData(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

// Componente para item do histórico
function HistoricoItem({ 
  conversa, 
  onSelect,
  searchTerm = ""
}: { 
  conversa: Conversa; 
  onSelect: (id: string) => void;
  searchTerm?: string;
}) {
  const dataFormatada = formatarData(conversa.iniciado_em);
  
  // Função para destacar o texto pesquisado
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => onSelect(conversa.id)}
        className="h-auto min-h-10 rounded-xl px-3 py-2 hover:bg-white/70"
      >
        <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          {conversa.loading ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-zinc-300"></div>
              <p className="text-sm text-zinc-400">Carregando...</p>
            </div>
          ) : (
            <>
              <p className="truncate text-sm font-medium">
                {searchTerm ? highlightText(conversa.preview || "Conversa sem mensagens", searchTerm) : (conversa.preview || "Conversa sem mensagens")}
              </p>
              <p className="text-xs text-zinc-400">
                {dataFormatada}
              </p>
            </>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar({
  isLogged,
  onOpenLogin,
  onLogout,
  userName = "Usuário",
  userRole = "user",
  userId,
  refreshKey = 0,
  onSelectConversa,
  onNewChat,
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { toggleSidebar, isMobile, state } = useSidebar();

  const isCollapsed = state === "collapsed";
  const isAdmin = userRole === "admin";

  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [conversasComMensagens, setConversasComMensagens] = useState<Conversa[]>([]);

  // Estado da busca por texto
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Conversa[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Função para buscar mensagens de uma conversa
  const fetchMensagensConversa = useCallback(async (conversaId: string): Promise<Mensagem[]> => {
    try {
      const response = await fetch(`${API_URL}/historico/conversas/${conversaId}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.mensagens || [];
    } catch (error) {
      console.error(`Erro ao buscar mensagens da conversa ${conversaId}:`, error);
      return [];
    }
  }, []);

  // Função para buscar preview e mensagens de uma conversa
  const fetchDetalhesConversa = useCallback(async (conversa: Conversa): Promise<Conversa> => {
    // Verifica cache primeiro
    if (conversasCache.has(conversa.id)) {
      const cached = conversasCache.get(conversa.id)!;
      return {
        ...conversa,
        preview: cached.preview,
        mensagens: cached.mensagens,
        loading: false
      };
    }
    
    try {
      const mensagens = await fetchMensagensConversa(conversa.id);
      
      // Busca a primeira mensagem do usuário para o preview
      const primeiraMensagem = mensagens.find(
        (msg) => msg.tipo_remetente === "usuario"
      );
      
      let preview = "Conversa sem mensagens";
      if (primeiraMensagem?.conteudo) {
        const conteudo = primeiraMensagem.conteudo;
        preview = conteudo.length > 60 ? conteudo.substring(0, 60) + "..." : conteudo;
      }
      
      // Salva no cache
      conversasCache.set(conversa.id, { preview, mensagens });
      
      return {
        ...conversa,
        preview,
        mensagens,
        loading: false
      };
    } catch (error) {
      console.error(`Erro ao buscar detalhes da conversa ${conversa.id}:`, error);
      return {
        ...conversa,
        preview: "Erro ao carregar",
        mensagens: [],
        loading: false
      };
    }
  }, [fetchMensagensConversa]);

  // Busca o histórico completo
  const fetchConversas = useCallback(async () => {
    if (!isLogged || !userId) {
      setConversas([]);
      setConversasComMensagens([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/historico/usuarios/${userId}/conversas`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Primeiro, seta as conversas sem detalhes (com loading)
        const conversasIniciais = data.map((conversa: Conversa) => ({
          ...conversa,
          preview: "Carregando...",
          loading: true
        }));
        setConversas(conversasIniciais);
        
        // Depois, busca os detalhes de cada conversa
        const conversasComDetalhes = await Promise.all(
          data.map((conversa: Conversa) => fetchDetalhesConversa(conversa))
        );
        setConversas(conversasComDetalhes);
        setConversasComMensagens(conversasComDetalhes);
      }
    } catch (error) {
      console.error("Erro ao buscar conversas:", error);
      setConversas([]);
      setConversasComMensagens([]);
    }
  }, [isLogged, userId, fetchDetalhesConversa]);

  useEffect(() => {
    fetchConversas();
  }, [fetchConversas, refreshKey]);

  // Função de busca local por texto
  const searchLocal = useCallback((termo: string) => {
    if (!termo.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    
    // Simula um pequeno delay para dar feedback visual
    setTimeout(() => {
      const termoLower = termo.toLowerCase().trim();
      
      const resultados = conversasComMensagens.filter(conversa => {
        // Busca no preview
        if (conversa.preview?.toLowerCase().includes(termoLower)) {
          return true;
        }
        
        // Busca nas mensagens
        if (conversa.mensagens) {
          return conversa.mensagens.some(msg => 
            msg.conteudo.toLowerCase().includes(termoLower)
          );
        }
        
        return false;
      });
      
      setSearchResults(resultados);
      setIsSearching(false);
    }, 300);
  }, [conversasComMensagens]);

  // Debounce para busca enquanto digita
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Limpa o timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce de 500ms
    searchTimeoutRef.current = setTimeout(() => {
      searchLocal(value);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchOpen(false);
    setSearchTerm("");
    setSearchResults(null);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
    if (isMobile) toggleSidebar();
  }, [navigate, isMobile, toggleSidebar]);

  const handleNewChat = () => {
    onNewChat?.();
    handleNavigate("/");
    // Limpa a busca ao criar novo chat
    handleClearSearch();
  };

  const handleLogoutClick = () => {
    conversasCache.clear(); // Limpa o cache ao deslogar
    onLogout();
    if (isMobile) toggleSidebar();
    navigate("/");
  };

  const handleSelectConversa = useCallback((conversaId: string) => {
    onSelectConversa?.(conversaId);
    handleClearSearch();
    handleNavigate("/");
  }, [onSelectConversa, handleNavigate]);

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

            {/* Buscar chat por texto */}
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
                  <span className="truncate">Buscar conversa</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Painel de busca por texto */}
            {!isCollapsed && searchOpen && isLogged && (
              <div className="mx-1 mb-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                    <Search className="h-3.5 w-3.5" />
                    Buscar por texto
                  </span>
                  <button
                    onClick={handleClearSearch}
                    className="text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Digite o texto para buscar..."
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-[#4a90c2]"
                    autoFocus
                  />
                </div>

                {isSearching && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4a90c2] border-t-transparent"></div>
                    <p className="text-xs text-zinc-500">Buscando...</p>
                  </div>
                )}

                {searchResults !== null && !isSearching && searchTerm && (
                  <p className="mt-2 text-xs text-zinc-400">
                    {searchResults.length === 0
                      ? `Nenhuma conversa encontrada com "${searchTerm}"`
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
                    ? `Nenhuma conversa encontrada${searchTerm ? ` para "${searchTerm}"` : ""}.`
                    : "Nenhuma conversa ainda."}
                </p>
              ) : (
                listaExibida.map((conversa) => (
                  <HistoricoItem
                    key={conversa.id}
                    conversa={conversa}
                    onSelect={handleSelectConversa}
                    searchTerm={searchTerm}
                  />
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