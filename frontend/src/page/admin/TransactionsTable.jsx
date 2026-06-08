import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  pending:   { label: "Pending",   bg: "#FEF9C3", color: "#854D0E" },
  paid:      { label: "Lunas",     bg: "#DCFCE7", color: "#166534" },
  failed:    { label: "Gagal",     bg: "#FEE2E2", color: "#991B1B" },
  challenge: { label: "Challenge", bg: "#FEF3C7", color: "#92400E" },
};

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const formatDate = (str) => {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

const Th = ({ children, style }) => (
  <th style={{
    padding: "11px 14px", textAlign: "left",
    fontSize: 11, fontWeight: 700, color: "#94A3B8",
    textTransform: "uppercase", letterSpacing: 0.6,
    background: "#F8FAFC", whiteSpace: "nowrap",
    borderBottom: "1px solid #F1F5F9", ...style,
  }}>
    {children}
  </th>
);

const Td = ({ children, style }) => (
  <td style={{
    padding: "12px 14px", fontSize: 13, color: "#1E293B",
    borderBottom: "1px solid #F8FAFC", verticalAlign: "middle", ...style,
  }}>
    {children}
  </td>
);

const TransactionsTable = ({ transactions, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (filterStatus !== "all") list = list.filter(t => t.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.order_id?.toLowerCase().includes(q) ||
        String(t.project_id).includes(q)
      );
    }
    return list;
  }, [transactions, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

      {/* Toolbar */}
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        borderBottom: "1px solid #F8FAFC",
      }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 300, minWidth: 200 }}>
          <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari order ID atau project..."
            style={{
              width: "100%", padding: "8px 12px 8px 32px",
              borderRadius: 9, border: "1px solid #E2E8F0",
              fontSize: 13, color: "#1E293B", outline: "none",
              background: "#F8FAFC", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Filter status */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["all", "pending", "paid", "failed", "challenge"].map(s => {
            const active = filterStatus === s;
            const cfg = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => { setFilterStatus(s); setPage(1); }}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: active ? `1.5px solid ${cfg?.color || "#3B82F6"}` : "1px solid #E2E8F0",
                  background: active ? (cfg?.bg || "#DBEAFE") : "#fff",
                  color: active ? (cfg?.color || "#3B82F6") : "#64748B",
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}
              >
                {s === "all" ? "Semua" : cfg?.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Order ID</Th>
              <Th>Project ID</Th>
              <Th>Jumlah</Th>
              <Th>Status</Th>
              <Th>Tanggal</Th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>
                  Tidak ada transaksi ditemukan
                </td>
              </tr>
            ) : paginated.map((tx, i) => {
              const cfg = STATUS_CONFIG[tx.status] || STATUS_CONFIG.pending;
              return (
                <tr
                  key={tx.id}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Td style={{ color: "#94A3B8", fontSize: 12 }}>{(page - 1) * PAGE_SIZE + i + 1}</Td>
                  <Td>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: "#0F172A", fontWeight: 600 }}>
                      {tx.order_id}
                    </span>
                  </Td>
                  <Td style={{ color: "#64748B" }}>#{tx.project_id}</Td>
                  <Td>
                    <span style={{ fontWeight: 700, color: "#0F172A" }}>
                      {formatRupiah(tx.amount)}
                    </span>
                  </Td>
                  <Td>
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 20,
                      background: cfg.bg, color: cfg.color,
                    }}>
                      {cfg.label}
                    </span>
                  </Td>
                  <Td style={{ color: "#64748B", fontSize: 12 }}>{formatDate(tx.created_at)}</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: "12px 20px", borderTop: "1px solid #F8FAFC",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Halaman {page} dari {totalPages}</span>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;