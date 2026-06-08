import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, DollarSign, Check, Loader2, Pencil } from "lucide-react";
import { STATUS_ORDER, STATUS_CONFIG, formatDate } from "../../utils/adminConstants";
import StatusBadge from "./StatusBadge";
import StatusUpdater from "./StatusUpdater";
import OrderDetailModal from "./OrderDetailModal";
import { useProject } from "../../provider/project_provider";

const PAGE_SIZE = 10;

const formatRupiah = (value) => {
  if (value === null || value === undefined || value === "") return "–";
  const number = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const Th = ({ children, style }) => (
  <th style={{
    padding: "11px 14px", textAlign: "left",
    fontSize: 11, fontWeight: 700, color: "#94A3B8",
    textTransform: "uppercase", letterSpacing: 0.6,
    background: "#F8FAFC", whiteSpace: "nowrap",
    borderBottom: "1px solid #F1F5F9",
    ...style,
  }}>
    {children}
  </th>
);

const Td = ({ children, style }) => (
  <td style={{
    padding: "12px 14px", fontSize: 13, color: "#1E293B",
    borderBottom: "1px solid #F8FAFC", verticalAlign: "middle",
    ...style,
  }}>
    {children}
  </td>
);

/* ── Komponen set/edit harga inline ── */
const PriceCell = ({ order, onRefresh }) => {
  const { updateProjectPrice } = useProject(); // ✅ pakai context
  const rawPrice = order.planPriceRange || order.priceRange || order.plan_price_range;
  const hasPrice = !!rawPrice && rawPrice !== "–";

  const [editing, setEditing] = useState(false);
  const [priceInput, setPriceInput] = useState(rawPrice || "");
  const [priceLoading, setPriceLoading] = useState(false);

  const handleSave = async () => {
    if (!priceInput.trim()) return;
    setPriceLoading(true);
    const result = await updateProjectPrice(order.id, priceInput.trim()); // ✅ lewat context
    setPriceLoading(false);
    if (result.success) {
      setEditing(false);
      onRefresh?.(); // refresh list dari parent
    } else {
      alert(`Gagal set harga: ${result.message}`);
    }
  };

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          autoFocus
          value={priceInput}
          onChange={e => setPriceInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder="cth: 5000000"
          style={{
            padding: "4px 8px", borderRadius: 7,
            border: "1px solid #BFDBFE", fontSize: 12,
            outline: "none", width: 130,
          }}
        />
        <button
          onClick={handleSave}
          disabled={priceLoading || !priceInput.trim()}
          style={{
            width: 26, height: 26, borderRadius: 6, border: "none",
            background: "#22C55E", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: priceLoading ? "not-allowed" : "pointer",
            opacity: priceLoading ? 0.7 : 1,
          }}
        >
          {priceLoading
            ? <Loader2 size={12} style={{ animation: "spin 0.8s linear infinite" }} />
            : <Check size={12} />
          }
        </button>
        <button
          onClick={() => setEditing(false)}
          style={{
            width: 26, height: 26, borderRadius: 6,
            border: "1px solid #E2E8F0", background: "#fff",
            fontSize: 11, color: "#64748B", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  // ✅ Sudah ada harga → tampilkan harga + tombol edit pensil
  if (hasPrice) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
          {formatRupiah(rawPrice)}
        </span>
        <button
          onClick={() => { setPriceInput(rawPrice); setEditing(true); }}
          title="Edit harga"
          style={{
            width: 24, height: 24, borderRadius: 6,
            border: "1px solid #E2E8F0", background: "#F8FAFC",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Pencil size={11} color="#64748B" />
        </button>
      </div>
    );
  }

  // ✅ Belum ada harga → tombol Set Harga
  return (
    <button
      onClick={() => { setPriceInput(""); setEditing(true); }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 8,
        border: "1px solid #BFDBFE", background: "#EFF6FF",
        color: "#2563EB", fontSize: 12, fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <DollarSign size={12} />
      Set Harga
    </button>
  );
};

const FilterTabs = ({ orders, filterStatus, onFilter }) => (
  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
    {["all", ...STATUS_ORDER].map(s => {
      const active = filterStatus === s;
      const cfg = STATUS_CONFIG[s];
      return (
        <button
          key={s}
          onClick={() => onFilter(s)}
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
          {s !== "all" && (
            <span style={{ marginLeft: 5, opacity: 0.7 }}>
              {orders.filter(o => o.status === s).length}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

const Pagination = ({ page, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce((acc, n, idx, arr) => {
      if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
      acc.push(n);
      return acc;
    }, []);

  const btnStyle = (active = false, disabled = false) => ({
    width: 30, height: 30, borderRadius: 7,
    border: active ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
    background: active ? "#EFF6FF" : "#fff",
    color: active ? "#3B82F6" : "#374151",
    fontWeight: active ? 700 : 400,
    fontSize: 13, cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    opacity: disabled ? 0.4 : 1,
  });

  return (
    <div style={{
      padding: "12px 20px", borderTop: "1px solid #F8FAFC",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span style={{ fontSize: 12, color: "#94A3B8" }}>
        Halaman {page} dari {totalPages}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={() => onPageChange(p => Math.max(1, p - 1))} disabled={page === 1} style={btnStyle(false, page === 1)}>
          <ChevronLeft size={14} />
        </button>
        {pages.map((n, i) =>
          n === "…" ? (
            <span key={`dots-${i}`} style={{ width: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#94A3B8" }}>…</span>
          ) : (
            <button key={n} onClick={() => onPageChange(n)} style={btnStyle(n === page)}>{n}</button>
          )
        )}
        <button onClick={() => onPageChange(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={btnStyle(false, page === totalPages)}>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const EmptyRow = () => (
  <tr>
    <td colSpan={9} style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>
      Tidak ada orderan ditemukan
    </td>
  </tr>
);

const OrdersTable = ({ orders, onRefresh }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (filterStatus !== "all") list = list.filter(o => o.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o.projectTitle.toLowerCase().includes(q) ||
        o.contactName.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filterStatus, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

        {/* Toolbar */}
        <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", borderBottom: "1px solid #F8FAFC" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 300, minWidth: 200 }}>
            <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari proyek atau nama..."
              style={{ width: "100%", padding: "8px 12px 8px 32px", borderRadius: 9, border: "1px solid #E2E8F0", fontSize: 13, color: "#1E293B", outline: "none", background: "#F8FAFC", boxSizing: "border-box" }}
            />
          </div>
          <FilterTabs orders={orders} filterStatus={filterStatus} onFilter={v => { setFilterStatus(v); setPage(1); }} />
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Proyek</Th>
                <Th>Kategori</Th>
                <Th>Paket</Th>
                <Th>Kontak</Th>
                <Th>Tanggal</Th>
                <Th>Harga</Th>
                <Th>Status</Th>
                <Th style={{ textAlign: "center" }}>Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? <EmptyRow /> : paginated.map((order, i) => (
                <tr
                  key={order.id}
                  style={{ transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <Td style={{ color: "#94A3B8", fontSize: 12 }}>{(page - 1) * PAGE_SIZE + i + 1}</Td>
                  <Td>
                    <div style={{ fontWeight: 600, color: "#0F172A", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {order.projectTitle}
                    </div>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, background: "#F1F5F9", color: "#475569" }}>
                      {order.category}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ fontSize: 12, color: "#64748B" }}>{order.planTitle || "–"}</span>
                  </Td>
                  <Td>
                    <div style={{ fontSize: 13, color: "#0F172A" }}>{order.contactName}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{order.contactPhone}</div>
                  </Td>
                  <Td style={{ color: "#64748B", fontSize: 12 }}>{formatDate(order.createdAt)}</Td>

                  {/* ── Kolom Harga ── */}
                  <Td>
                    <PriceCell order={order} onRefresh={onRefresh} />
                  </Td>

                  <Td>
                    <StatusUpdater order={order} onUpdated={onRefresh} />
                  </Td>
                  <Td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => setDetail(order)}
                      style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Eye size={14} color="#64748B" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>

      {detail && (
        <OrderDetailModal order={detail} onClose={() => setDetail(null)} onUpdated={onRefresh} />
      )}
    </>
  );
};

export default OrdersTable;