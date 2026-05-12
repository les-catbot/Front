import { useEffect, useState } from "react";
import { Download, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// --- Circular Progress Component ---
interface CircularProgressProps {
  value: number;
  color: string;
  trackColor: string;
  size?: number;
  strokeWidth?: number;
}

function CircularProgress({
  value,
  color,
  trackColor,
  size = 100,
  strokeWidth = 8,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(timeout);
  }, [value]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
    </svg>
  );
}

// --- Metric Card Component ---
interface MetricCardProps {
  value: number;
  label: string;
  sublabel: string;
  color: string;
  trackColor: string;
  icon: React.ReactNode;
}

function MetricCard({ value, label, sublabel, color, trackColor, icon }: MetricCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        flex: 1,
        minWidth: "180px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "40px",
          height: "3px",
          borderRadius: "0 0 4px 4px",
          background: color,
        }}
      />

      {/* Ring + percentage */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress value={value} color={color} trackColor={trackColor} size={100} strokeWidth={8} />
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", lineHeight: 1 }}>
            {value}%
          </span>
          <span style={{ color, display: "flex" }}>{icon}</span>
        </div>
      </div>

      {/* Labels */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#334155", margin: 0, lineHeight: 1.4 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "4px 0 0", lineHeight: 1.3 }}>
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

// --- Counter Card ---
interface CounterCardProps {
  title: string;
  value: number;
  unit: string;
}

function CounterCard({ title, value, unit }: CounterCardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #5b8fa8 0%, #4a7a94 100%)",
        borderRadius: "16px",
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "12px",
        flex: 1,
        minWidth: "200px",
        boxShadow: "0 4px 16px rgba(91,143,168,0.3)",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.85)",
          margin: 0,
          fontWeight: 500,
          lineHeight: 1.4,
        }}
      >
        {title}
      </p>
      <div>
        <span
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1,
            display: "block",
            letterSpacing: "-1px",
          }}
        >
          {display.toLocaleString("pt-BR")}
        </span>
        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", marginTop: "4px", display: "block" }}>
          {unit}
        </span>
      </div>
    </div>
  );
}

// --- Report Button ---
interface ReportButtonProps {
  label: string;
  onClick?: () => void;
}

function ReportButton({ label, onClick }: ReportButtonProps) {
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        background: hover ? "#4a7a94" : "#5b8fa8",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s ease",
        width: "100%",
        transform: hover ? "translateX(2px)" : "none",
        boxShadow: hover ? "0 4px 12px rgba(91,143,168,0.4)" : "0 2px 6px rgba(91,143,168,0.2)",
      }}
    >
      <Download size={15} />
      {label}
    </button>
  );
}

// --- Section Title ---
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "#94a3b8",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        margin: "0 0 16px",
      }}
    >
      {children}
    </h2>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const metrics = [
    {
      value: 83,
      label: "Taxa de Sucesso",
      sublabel: "",
      color: "#7c6fcd",
      trackColor: "#ede9ff",
      icon: <TrendingUp size={12} />,
    },
    {
      value: 66,
      label: "Taxa de Aprovação",
      sublabel: "de respostas",
      color: "#2dd4a6",
      trackColor: "#d0faf1",
      icon: <TrendingUp size={12} />,
    },
    {
      value: 23,
      label: "Taxa de Reformulação",
      sublabel: "de perguntas",
      color: "#f87171",
      trackColor: "#fee2e2",
      icon: <TrendingDown size={12} />,
    },
  ];

  const handleRefresh = () => window.location.reload();

  return (
    <main
      style={{
        flex: 1,
        padding: "32px 28px",
        background: "#f3f3f3",
        minHeight: "100vh",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#1e293b",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "6px 0 0" }}>
            Visão geral dos feedbacks e métricas de desempenho
          </p>
        </div>
        <button
          onClick={handleRefresh}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            background: "#ffffff",
            color: "#64748b",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <RefreshCw size={13} />
          Atualizar
        </button>
      </div>

      {/* Metrics Row */}
      <section style={{ marginBottom: "24px" }}>
        <SectionTitle>Indicadores de Feedback</SectionTitle>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      </section>

      {/* Counters + Reports Row */}
      <section>
        <SectionTitle>Volume & Relatórios</SectionTitle>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "stretch" }}>
          {/* Counter: Today */}
          <CounterCard
            title="Quantidade de perguntas realizadas hoje"
            value={250}
            unit="Perguntas"
          />

          {/* Counter: Month */}
          <CounterCard
            title="Quantidade de perguntas realizadas este mês"
            value={1400}
            unit="Perguntas"
          />

          {/* Report Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "center",
              minWidth: "180px",
            }}
          >
            <ReportButton label="Relatório Diário" />
            <ReportButton label="Relatório Mensal" />
            <ReportButton label="Relatório Anual" />
          </div>
        </div>
      </section>
    </main>
  );
}