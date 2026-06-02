import { useEffect, useState, useCallback } from "react";
import { Download, TrendingUp, TrendingDown, RefreshCw, Star } from "lucide-react";

// --- Types ---
interface Avaliacao {
  id: string;
  mensagem_id: string;
  usuario_id: string;
  nota: number;
  comentario: string;
  criado_em: string;
}

// --- Helpers ---
function hoje(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function mesAtual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function anoAtual(): string {
  return String(new Date().getFullYear());
}

async function fetchAllAvaliacoes(): Promise<Avaliacao[]> {
  const size = 100;
  let page = 0;
  let results: Avaliacao[] = [];
  let total: number | null = null;

  while (true) {
    const res = await fetch(
      `http://localhost:8000/api/v1/avaliacoes?skip=${page * size}&limit=${size}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.avaliacoes) results.push(...data.avaliacoes);
    if (total === null) total = data.total ?? 0;
    if (results.length >= total! || !data.avaliacoes || data.avaliacoes.length < size) break;
    page++;
  }
  return results;
}

function exportCSV(data: Avaliacao[], periodo: "diario" | "mensal" | "anual") {
  let filtered = data;
  if (periodo === "diario") filtered = data.filter((a) => a.criado_em?.startsWith(hoje()));
  else if (periodo === "mensal") filtered = data.filter((a) => a.criado_em?.startsWith(mesAtual()));
  else if (periodo === "anual") filtered = data.filter((a) => a.criado_em?.startsWith(anoAtual()));

  const header = "id,mensagem_id,usuario_id,nota,comentario,criado_em";
  const rows = filtered.map((a) =>
    [a.id, a.mensagem_id, a.usuario_id, a.nota, `"${(a.comentario || "").replace(/"/g, '""')}"`, a.criado_em].join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `relatorio_${periodo}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

// --- Circular Progress ---
function CircularProgress({
  value,
  color,
  trackColor,
  size = 100,
  strokeWidth = 8,
}: {
  value: number;
  color: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
    </svg>
  );
}

// --- Metric Card ---
function MetricCard({
  value,
  label,
  sublabel,
  color,
  trackColor,
  icon,
  loading,
}: {
  value: number;
  label: string;
  sublabel?: string;
  color: string;
  trackColor: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <div style={{
      background: "#ffffff", borderRadius: "16px", padding: "28px 24px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)", flex: 1, minWidth: "180px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "40px", height: "3px", borderRadius: "0 0 4px 4px", background: color }} />
      {loading ? (
        <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 12 }}>Carregando…</div>
      ) : (
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress value={value} color={color} trackColor={trackColor} size={100} strokeWidth={8} />
          <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: "1px" }}>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", lineHeight: 1 }}>{value}%</span>
            <span style={{ color }}>{icon}</span>
          </div>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0, lineHeight: 1.4 }}>{label}</p>
        {sublabel && <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0", lineHeight: 1.3 }}>{sublabel}</p>}
      </div>
    </div>
  );
}

// --- Counter Card ---
function CounterCard({ title, value, unit, loading }: { title: string; value: number; unit: string; loading: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading) return;
    let start = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value, loading]);

  return (
    <div style={{
      background: "linear-gradient(135deg, #5b8fa8 0%, #4a7a94 100%)",
      borderRadius: "16px", padding: "28px 32px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      gap: "12px", flex: 1, minWidth: "200px",
      boxShadow: "0 4px 16px rgba(91,143,168,0.3)",
    }}>
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{title}</p>
      <div>
        <span style={{ fontSize: "52px", fontWeight: 800, color: "#ffffff", lineHeight: 1, display: "block", letterSpacing: "-1px" }}>
          {loading ? "–" : display.toLocaleString("pt-BR")}
        </span>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "4px", display: "block" }}>{unit}</span>
      </div>
    </div>
  );
}

// --- Report Button ---
function ReportButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 20px", borderRadius: "10px", border: "none",
        background: hover ? "#4a7a94" : "#5b8fa8", color: "#ffffff",
        fontSize: "13px", fontWeight: 500, cursor: "pointer",
        transition: "all 0.2s ease", width: "100%",
        transform: hover ? "translateX(2px)" : "none",
        boxShadow: hover ? "0 4px 12px rgba(91,143,168,0.4)" : "0 2px 6px rgba(91,143,168,0.2)",
      }}
    >
      <Download size={15} />
      {label}
    </button>
  );
}

// --- Nota Bar ---
function NotaBar({ nota, count, total, color }: { nota: number; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
      <span style={{ fontSize: "12px", color: "#64748b", minWidth: "50px" }}>Nota {nota} ★</span>
      <div style={{ flex: 1, height: "8px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: "4px", background: color, width: `${width}%`, transition: "width 1s ease-in-out" }} />
      </div>
      <span style={{ fontSize: "12px", color: "#94a3b8", minWidth: "24px", textAlign: "right" }}>{count}</span>
    </div>
  );
}

// --- Section Title ---
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
      {children}
    </h2>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllAvaliacoes();
      setAvaliacoes(data);
    } catch (e: any) {
      setError("Não foi possível carregar os dados da API: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // --- Derived metrics ---
  const total = avaliacoes.length;
  const aprovados = avaliacoes.filter((a) => a.nota >= 4).length;
  const ruins = avaliacoes.filter((a) => a.nota <= 2).length;

  const txSucesso = total > 0 ? Math.round((aprovados / total) * 100) : 0;
  const txAprov = total > 0 ? Math.round((aprovados / total) * 100) : 0;
  const txRef = total > 0 ? Math.round((ruins / total) * 100) : 0;

  const hojeCount = avaliacoes.filter((a) => a.criado_em?.startsWith(hoje())).length;
  const mesCount = avaliacoes.filter((a) => a.criado_em?.startsWith(mesAtual())).length;

  const media = total > 0 ? avaliacoes.reduce((s, a) => s + a.nota, 0) / total : 0;
  const dist: Record<number, number> = {};
  avaliacoes.forEach((a) => { dist[a.nota] = (dist[a.nota] || 0) + 1; });

  const notaColors: Record<number, string> = { 1: "#f87171", 2: "#fb923c", 3: "#facc15", 4: "#34d399", 5: "#818cf8" };

  const metrics = [
    { value: txSucesso, label: "Taxa de Sucesso", sublabel: "", color: "#7c6fcd", trackColor: "#ede9ff", icon: <TrendingUp size={12} /> },
    { value: txAprov, label: "Taxa de Aprovação", sublabel: "de respostas", color: "#2dd4a6", trackColor: "#d0faf1", icon: <TrendingUp size={12} /> },
    { value: txRef, label: "Taxa de Reformulação", sublabel: "de perguntas", color: "#f87171", trackColor: "#fee2e2", icon: <TrendingDown size={12} /> },
  ];

  const summaryItems = [
    { label: "Avaliações positivas", val: aprovados, color: "#34d399" },
    { label: "Avaliações neutras", val: avaliacoes.filter((a) => a.nota === 3).length, color: "#facc15" },
    { label: "Avaliações negativas", val: ruins, color: "#f87171" },
    { label: "Com comentário", val: avaliacoes.filter((a) => a.comentario?.trim()).length, color: "#818cf8" },
    { label: "Total de avaliações", val: total, color: "#5b8fa8" },
  ];

  return (
    <main style={{ flex: 1, padding: "32px 28px", background: "#f3f3f3", minHeight: "100vh", fontFamily: "'Nunito', 'Segoe UI', sans-serif", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e293b", margin: 0, lineHeight: 1.2 }}>Dashboard</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "6px 0 0" }}>Visão geral dos feedbacks e métricas de desempenho</p>
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#ffffff", color: "#64748b", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
          <RefreshCw size={13} /> Atualizar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "10px", padding: "10px 16px", color: "#991b1b", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Metrics */}
      <section style={{ marginBottom: "24px" }}>
        <SectionTitle>Indicadores de Feedback</SectionTitle>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {metrics.map((m) => <MetricCard key={m.label} {...m} loading={loading} />)}
        </div>
      </section>

      {/* Counters + Reports */}
      <section style={{ marginBottom: "24px" }}>
        <SectionTitle>Volume & Relatórios</SectionTitle>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "stretch" }}>
          <CounterCard title="Quantidade de perguntas realizadas hoje" value={hojeCount} unit="Perguntas" loading={loading} />
          <CounterCard title="Quantidade de perguntas realizadas este mês" value={mesCount} unit="Perguntas" loading={loading} />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", minWidth: "180px" }}>
            <ReportButton label="Relatório Diário" onClick={() => exportCSV(avaliacoes, "diario")} />
            <ReportButton label="Relatório Mensal" onClick={() => exportCSV(avaliacoes, "mensal")} />
            <ReportButton label="Relatório Anual" onClick={() => exportCSV(avaliacoes, "anual")} />
          </div>
        </div>
      </section>

      {/* Distribuição de Notas */}
      <section>
        <SectionTitle>Distribuição de Notas</SectionTitle>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", flex: 1, minWidth: "200px" }}>
            {!loading && total > 0 && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f0fdf4", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 700, color: "#166534", marginBottom: "16px" }}>
                <Star size={13} /> {media.toFixed(1)} média geral
              </div>
            )}
            {loading ? (
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Carregando…</p>
            ) : (
              [5, 4, 3, 2, 1].map((n) => (
                <NotaBar key={n} nota={n} count={dist[n] || 0} total={total} color={notaColors[n]} />
              ))
            )}
          </div>
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", minWidth: "180px", maxWidth: "220px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "12px" }}>Resumo</p>
            {loading ? (
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Carregando…</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {summaryItems.map((it) => (
                  <div key={it.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                    <span style={{ color: "#64748b" }}>{it.label}</span>
                    <span style={{ fontWeight: 700, color: it.color }}>{it.val.toLocaleString("pt-BR")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}