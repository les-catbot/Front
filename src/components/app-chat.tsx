import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Printer, MessageSquare, X, Send, Star } from "lucide-react";

const API_URL = "http://localhost:8000/api/v1";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  mensagemUUID?: string;
};

interface AppChatProps {
  isLogged: boolean;
  userId: string | null;
  conversaId: string | null;
  onConversaIdChange: (id: string | null) => void;
  onConversaCriada?: () => void; // avisa o App que uma nova conversa foi criada → sidebar atualiza
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// --- Star Rating ---
function StarRating({
  nota,
  onRate,
  disabled,
}: {
  nota: number | null;
  onRate: (n: number) => void;
  disabled: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? nota ?? 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          disabled={disabled}
          onClick={() => onRate(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          title={`${n} estrela${n > 1 ? "s" : ""}`}
          style={{
            background: "none",
            border: "none",
            cursor: disabled ? "default" : "pointer",
            padding: "2px",
            lineHeight: 1,
            transition: "transform 0.1s",
            transform: hovered === n ? "scale(1.25)" : "scale(1)",
          }}
        >
          <Star
            size={14}
            strokeWidth={1.8}
            style={{
              color: n <= active ? "#f59e0b" : "#d1d5db",
              fill: n <= active ? "#f59e0b" : "none",
              transition: "color 0.15s, fill 0.15s",
            }}
          />
        </button>
      ))}
    </div>
  );
}

export function AppChat({
  isLogged,
  userId,
  conversaId,
  onConversaIdChange,
  onConversaCriada,
}: AppChatProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [notas, setNotas] = useState<Record<number, number>>({});
  const [openComment, setOpenComment] = useState<number | null>(null);
  const [commentValues, setCommentValues] = useState<Record<number, string>>({});
  const [sendingFeedback, setSendingFeedback] = useState<Record<number, boolean>>({});
  const printRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  // Carrega histórico quando conversaId muda (ex: clicar em conversa da sidebar)
  useEffect(() => {
    if (!conversaId) {
      setMessages([]);
      return;
    }
    setIsLoadingHistory(true);
    setMessages([]);
    fetch(`${API_URL}/historico/conversas/${conversaId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        const msgs: Message[] = (data.mensagens ?? []).map(
          (
            m: { id: string; conteudo: string; tipo_remetente: "usuario" | "bot" },
            index: number
          ) => ({
            id: index,
            role: m.tipo_remetente === "usuario" ? "user" : "assistant",
            content: m.conteudo,
            mensagemUUID: m.id,
          })
        );
        setMessages(msgs);
      })
      .catch(() => {
        setMessages([
          {
            id: 0,
            role: "assistant",
            content: "Não foi possível carregar o histórico desta conversa.",
          },
        ]);
      })
      .finally(() => setIsLoadingHistory(false));
  }, [conversaId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendAvaliacao = async (
    messageId: number,
    nota: number,
    comentario: string,
    mensagemUUID: string
  ) => {
    if (!userId) return;
    setSendingFeedback((prev) => ({ ...prev, [messageId]: true }));
    try {
      const body = {
        mensagem_id: mensagemUUID,
        usuario_id: userId,
        nota,
        comentario,
      };
      const res = await fetch(`${API_URL}/avaliacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) console.error("[avaliacao] erro", res.status, await res.text());
    } catch (e) {
      console.error("[avaliacao] falha de rede", e);
    } finally {
      setSendingFeedback((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleRate = async (message: Message, nota: number) => {
    setNotas((prev) => ({ ...prev, [message.id]: nota }));
    await sendAvaliacao(
      message.id,
      nota,
      commentValues[message.id] ?? "",
      message.mensagemUUID ?? uuidv4()
    );
  };

  const handleSendComment = async (message: Message) => {
    const nota = notas[message.id] ?? 5;
    await sendAvaliacao(
      message.id,
      nota,
      commentValues[message.id] ?? "",
      message.mensagemUUID ?? uuidv4()
    );
    setOpenComment(null);
  };

  const handlePrint = () => window.print();

  const handleSendMessage = async () => {
    const text = inputValue.trim();
    if (!text || !isLogged || isSending) return;

    const userMessage: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      let idConversa = conversaId;

      // Se não há conversa ativa, cria uma nova
      if (!idConversa) {
        const iniciar = await fetch(`${API_URL}/chat/iniciar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id: userId }),
        });
        if (!iniciar.ok) throw new Error();
        const iniciarData = await iniciar.json();
        idConversa = iniciarData.conversa_id;
        onConversaIdChange(idConversa);

        // Avisa o App que uma conversa nova foi criada → sidebar rebusca o histórico
        onConversaCriada?.();
      }

      const res = await fetch(`${API_URL}/chat/perguntar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversa_id: idConversa, texto: text }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            data.resposta ?? data.texto ?? data.content ?? JSON.stringify(data),
          mensagemUUID: data.mensagem_id ?? data.id ?? undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Erro ao conectar com o servidor. Tente novamente.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: fixed; top: 0; left: 0; width: 100%; padding: 24px; font-family: sans-serif; }
          .no-print { display: none !important; }
        }
      `}</style>

      <main className="flex-1">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-8 py-6">

          {isLoadingHistory ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-neutral-400">Carregando conversa...</p>
            </div>

          ) : !hasMessages ? (
            <>
              <div className="pt-16 text-center">
                <h1 className="font-mono text-[56px] font-black leading-[1.15] text-black">
                  Bem vindo(a)!<br />ao CatBot
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
              <div
                id="print-area"
                ref={printRef}
                className="mb-6 flex-1 space-y-4 overflow-y-auto pt-6"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      message.role === "user" ? "items-end" : "items-start"
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

                    {message.role === "assistant" && (
                      <div className="no-print mt-1 flex flex-col gap-1 px-1">
                        <div className="flex items-center gap-2">
                          <StarRating
                            nota={notas[message.id] ?? null}
                            onRate={(n) => handleRate(message, n)}
                            disabled={sendingFeedback[message.id] ?? false}
                          />

                          <button
                            onClick={() =>
                              setOpenComment(
                                openComment === message.id ? null : message.id
                              )
                            }
                            title="Comentar"
                            className={`rounded-md p-1 transition-colors ${
                              openComment === message.id
                                ? "text-[#4a90c2]"
                                : "text-neutral-400 hover:text-neutral-600"
                            }`}
                          >
                            <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>

                          <button
                            onClick={handlePrint}
                            title="Imprimir conversa"
                            className="rounded-md p-1 text-neutral-400 transition-colors hover:text-neutral-600"
                          >
                            <Printer className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </div>

                        {openComment === message.id && (
                          <div className="flex items-center gap-1 rounded-xl border border-[#4a90c2] bg-white px-3 py-1.5 shadow-sm">
                            <input
                              autoFocus
                              type="text"
                              value={commentValues[message.id] ?? ""}
                              onChange={(e) =>
                                setCommentValues((prev) => ({
                                  ...prev,
                                  [message.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSendComment(message);
                                if (e.key === "Escape") setOpenComment(null);
                              }}
                              placeholder="Deixe um comentário..."
                              className="flex-1 bg-transparent text-xs text-neutral-700 outline-none placeholder:text-neutral-400"
                            />
                            <button
                              onClick={() => handleSendComment(message)}
                              disabled={sendingFeedback[message.id]}
                              className="text-[#4a90c2] disabled:opacity-40"
                            >
                              <Send className="h-3 w-3" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => setOpenComment(null)}
                              className="text-neutral-400 hover:text-neutral-600"
                            >
                              <X className="h-3 w-3" strokeWidth={2} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] rounded-2xl bg-white px-4 py-3 text-sm text-neutral-500 shadow-sm">
                      Digitando...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="no-print sticky bottom-0 bg-[#f3f3f3] pb-4 pt-2">
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
    </>
  );
}