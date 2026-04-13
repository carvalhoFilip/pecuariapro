"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide1Dashboard } from "@/components/landing/DashboardPreview";

const slides = [
  { id: "dashboard", label: "Painel" },
  { id: "venda", label: "Nova venda" },
  { id: "custo", label: "Novo custo" },
];

function Slide2Venda() {
  return (
    <div
      style={{
        width: "100%",
        flexShrink: 0,
        height: "100%",
        background: "#fafaf9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", pointerEvents: "none" }} />
      <div
        style={{
          position: "relative",
          background: "white",
          borderRadius: 16,
          padding: 16,
          width: "100%",
          maxWidth: "min(360px, 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          zIndex: 1,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🐂
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#14532d" }}>Nova venda</div>
            <div style={{ fontSize: 11, color: "#a8a29e" }}>Preencha os dados abaixo</div>
          </div>
          <div style={{ marginLeft: "auto", color: "#d4d4d0", cursor: "pointer" }}>✕</div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {[1, 0, 0, 0, 0].map((active, i) => (
            <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: active ? "#16a34a" : "#e7e5e4" }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Data da venda", value: "13/04/2026", valid: true },
            { label: "Qtd de animais", value: "42", valid: true },
            { label: "Peso bruto (kg)", value: "13.440", valid: true },
            { label: "Peso líquido (kg)", value: "6.720", valid: true },
            { label: "Preço por @ (R$)", value: "320", valid: true },
            { label: "Observação", value: "Comprador: João", valid: false },
          ].map((field, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#78716c", marginBottom: 4 }}>{field.label}</div>
              <div
                style={{
                  height: 32,
                  borderRadius: 8,
                  border: "1.5px solid",
                  borderColor: field.valid ? "#16a34a" : "#e7e5e4",
                  padding: "0 10px",
                  fontSize: 12,
                  color: "#292524",
                  display: "flex",
                  alignItems: "center",
                  background: field.valid ? "#f0fdf4" : "white",
                }}
              >
                {field.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "#16a34a", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Resumo da venda
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Arrobas", value: "448 @" },
              { label: "Valor total", value: "R$ 143.360" },
              { label: "Por animal", value: "R$ 3.413" },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 9, color: "#16a34a", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#14532d" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e7e5e4",
              fontSize: 11,
              color: "#78716c",
              cursor: "pointer",
            }}
          >
            Cancelar
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#15803d",
              color: "white",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Registrar venda →
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide3Custo() {
  const categorias = [
    { label: "Ração", ativo: true },
    { label: "Vacina", ativo: false },
    { label: "Medicamento", ativo: false },
    { label: "Funcionários", ativo: false },
    { label: "Outros", ativo: false },
  ];

  return (
    <div
      style={{
        width: "100%",
        flexShrink: 0,
        height: "100%",
        background: "#fafaf9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", pointerEvents: "none" }} />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "white",
          borderRadius: 16,
          padding: 16,
          width: "100%",
          maxWidth: "min(320px, 100%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#f0fdf4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            🧾
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#14532d" }}>Novo custo</div>
            <div style={{ fontSize: 11, color: "#a8a29e" }}>Registre um custo da fazenda</div>
          </div>
          <div style={{ marginLeft: "auto", color: "#d4d4d0" }}>✕</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#78716c", marginBottom: 4 }}>Valor (R$)</div>
            <div
              style={{
                height: 32,
                borderRadius: 8,
                border: "1.5px solid #16a34a",
                padding: "0 10px",
                fontSize: 12,
                color: "#292524",
                display: "flex",
                alignItems: "center",
                background: "#f0fdf4",
              }}
            >
              3.000,00
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#78716c", marginBottom: 4 }}>Data</div>
            <div
              style={{
                height: 32,
                borderRadius: 8,
                border: "1.5px solid #e7e5e4",
                padding: "0 10px",
                fontSize: 12,
                color: "#292524",
                display: "flex",
                alignItems: "center",
              }}
            >
              13/04/2026
            </div>
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 500, color: "#78716c", marginBottom: 6 }}>Categoria</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
          {categorias.map((cat, i) => (
            <div
              key={i}
              style={{
                padding: "8px 4px",
                borderRadius: 8,
                textAlign: "center",
                border: `1.5px solid ${cat.ativo ? "#16a34a" : "#e7e5e4"}`,
                background: cat.ativo ? "#f0fdf4" : "white",
                fontSize: 10,
                fontWeight: cat.ativo ? 600 : 400,
                color: cat.ativo ? "#15803d" : "#78716c",
                cursor: "pointer",
              }}
            >
              {cat.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #e7e5e4",
              fontSize: 11,
              color: "#78716c",
              cursor: "pointer",
            }}
          >
            Cancelar
          </div>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#15803d",
              color: "white",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Registrar custo
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreviewCarousel() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => Math.max(0, i - 1));
  const next = () => setCurrent((i) => Math.min(slides.length - 1, i + 1));

  return (
    <div className="relative select-none">
      <div
        style={{
          borderRadius: 16,
          border: "1px solid #e7e5e4",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          background: "#fafaf9",
          width: "100%",
          maxWidth: 560,
        }}
      >
        <div
          style={{
            height: 36,
            background: "#f1efea",
            borderBottom: "1px solid #e7e5e4",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 6,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "#a8a29e" }}>pecuariapro.com.br</div>
        </div>

        <div style={{ position: "relative", height: "min(420px, 68vw)", overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              transform: `translateX(-${current * 100}%)`,
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div style={{ width: "100%", flexShrink: 0, height: "100%", overflow: "hidden", display: "flex" }}>
              <div style={{ width: "100%", height: "100%" }}>
                <Slide1Dashboard />
              </div>
            </div>
            <Slide2Venda />
            <Slide3Custo />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #e7e5e4",
            background: current === 0 ? "#f5f5f4" : "white",
            cursor: current === 0 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: current === 0 ? 0.4 : 1,
          }}
        >
          <ChevronLeft size={16} color="#78716c" />
        </button>

        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(i)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 20,
              border: "none",
              background: i === current ? "#15803d" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: i === current ? "white" : "#d4d4d0" }} />
            <span style={{ fontSize: 12, color: i === current ? "white" : "#a8a29e", fontWeight: i === current ? 600 : 400 }}>
              {slide.label}
            </span>
          </button>
        ))}

        <button
          onClick={next}
          disabled={current === slides.length - 1}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #e7e5e4",
            background: current === slides.length - 1 ? "#f5f5f4" : "white",
            cursor: current === slides.length - 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: current === slides.length - 1 ? 0.4 : 1,
          }}
        >
          <ChevronRight size={16} color="#78716c" />
        </button>
      </div>
    </div>
  );
}
