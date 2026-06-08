import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { STATUS_CONFIG, STATUS_ORDER } from "../../utils/adminConstants";
import StatusBadge from "./StatusBadge";
import API from "../../utils/api";

const StatusUpdater = ({ order, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      });
    }
  }, [open]);

  const handleChange = async (newStatus) => {
    if (newStatus === order.status) { setOpen(false); return; }
    setLoading(true);
    setOpen(false);
    try {
      await API.patch(`/project/${order.id}/status`, { status: newStatus });
      onUpdated?.();
    } catch (err) {
      alert(`Gagal update status: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 8,
          border: "1px solid #E2E8F0",
          background: "#fff", cursor: loading ? "not-allowed" : "pointer",
          fontSize: 12, fontWeight: 500, color: "#374151",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <StatusBadge status={order.status} size="sm" />
        {loading
          ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} />
          : <ChevronDown size={13} color="#94A3B8" />
        }
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{
            position: "fixed",
            top: dropPos.top,
            left: dropPos.left,
            zIndex: 9999,
            background: "#fff", borderRadius: 12,
            border: "1px solid #E2E8F0",
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            minWidth: 160, padding: "4px",
          }}>
            {STATUS_ORDER.map(s => {
              const cfg = STATUS_CONFIG[s];
              const active = s === order.status;
              return (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "8px 10px",
                    borderRadius: 8, border: "none",
                    background: active ? "#F8FAFC" : "transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? cfg.color : "#374151" }}>
                    {cfg.label}
                  </span>
                  {active && <span style={{ marginLeft: "auto", fontSize: 11, color: cfg.color }}>✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
};

export default StatusUpdater;