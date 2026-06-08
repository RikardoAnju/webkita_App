import React from "react";
import { STATUS_CONFIG } from "../../utils/adminConstants";

const StatusBadge = ({ status, size = "md" }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#64748B", bg: "#F1F5F9" };
  const pad = size === "sm" ? "2px 8px" : "4px 10px";
  const fs  = size === "sm" ? 11 : 12;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: pad, borderRadius: 20,
      fontSize: fs, fontWeight: 600,
      background: cfg.bg, color: cfg.color,
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: cfg.color, flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
};

export default StatusBadge;