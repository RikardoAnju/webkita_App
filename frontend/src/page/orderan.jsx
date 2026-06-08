import React, { useState, useEffect } from "react";
import {
  Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp,
  Calendar, User, Phone, FileText, TrendingUp, RefreshCw, Layers, Tag, CreditCard,
} from "lucide-react";
import API from "../utils/api";
import { usePayment } from "../provider/payment_provider";

const calculateProgress = (status) => {
  const map = { pending: 10, process: 50, approved: 75, done: 100, rejected: 0 };
  return map[status] ?? 0;
};

const formatDate = (dateString) => {
  if (!dateString) return "–";
  return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const calculateEstimatedCompletion = (createdAt, planTitle) => {
  if (!createdAt) return "–";
  const days = { Starter: 14, Professional: 30, Business: 60, Enterprise: 120 }[planTitle] || 30;
  const d = new Date(createdAt);
  d.setDate(d.getDate() + days);
  return formatDate(d.toISOString());
};

const transformBackendData = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const status = item.status || "pending";
    const planTitle = item.plan_title;
    const createdAt = item.created_at;
    return {
      id: item.id,
      userId: item.user_id,
      projectTitle: item.project_title,
      category: item.category,
      description: item.description,
      skills: item.skills,
      contactName: item.contact_name,
      contactPhone: item.contact_phone,
      additionalNotes: item.additional_notes || "",
      planTitle,
      planPriceRange: item.plan_price_range || null,
      status,
      progress: calculateProgress(status),
      createdAt: formatDate(createdAt),
      estimatedCompletion: calculateEstimatedCompletion(createdAt, planTitle),
    };
  });
};

const STATUS = {
  pending: { label: "Menunggu", bg: "#FEF9C3", text: "#92400E", dot: "#F59E0B" },
  process: { label: "Dalam Proses", bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6" },
  approved: { label: "Disetujui", bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  rejected: { label: "Ditolak", bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444" },
  done: { label: "Selesai", bg: "#F3E8FF", text: "#6B21A8", dot: "#A855F7" },
};

const PLAN_COLORS = {
  Starter: { from: "#3B82F6", to: "#1D4ED8" },
  Professional: { from: "#8B5CF6", to: "#6D28D9" },
  Business: { from: "#10B981", to: "#065F46" },
  Enterprise: { from: "#F59E0B", to: "#B45309" },
};

const FILTER_ORDER = ["all", "pending", "process", "approved", "rejected", "done"];

// ─── load midtrans dinamis ────────────────────────────────────────────────────
const loadMidtrans = () => {
  return new Promise((resolve) => {
    if (window.snap) return resolve();
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-4Lymuq91xf7MtA6u");
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

// ─── sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: cfg.bg, color: cfg.text, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ value, status }) => {
  const color = status === "done" ? "#22C55E" : status === "rejected" ? "#E5E7EB" : status === "approved" ? "#A855F7" : "#3B82F6";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#6B7280" }}>Progress</span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 99, background: "#E5E7EB", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, borderRadius: 99, background: color, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${color}`,
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
  }}>
    <div>
      <p style={{ margin: 0, fontSize: 13, color: "#6B7280", marginBottom: 4 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>{value}</p>
    </div>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={22} color={color} />
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <p style={{ margin: "0 0 3px", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</p>
    <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.6, wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{children}</p>
  </div>
);

const OrderCard = ({ order, isExpanded, onToggle, onPay, payLoading }) => {
  const planColor = PLAN_COLORS[order.planTitle] || { from: "#6B7280", to: "#374151" };
  const canPay = order.planPriceRange && !["rejected", "done"].includes(order.status);

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      boxShadow: isExpanded ? "0 8px 30px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.07)",
      overflow: "hidden", transition: "box-shadow 0.25s ease",
      border: isExpanded ? "1.5px solid #3B82F6" : "1.5px solid transparent",
    }}>
      <div onClick={onToggle} style={{ padding: "20px 24px", cursor: "pointer" }}>
        {order.planTitle && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 20, marginBottom: 14,
            background: `linear-gradient(90deg, ${planColor.from}, ${planColor.to})`,
            color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 0.3,
          }}>
            <Tag size={11} /> Paket {order.planTitle}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {order.projectTitle}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{order.category}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <StatusBadge status={order.status} />
            <div style={{ color: "#9CA3AF" }}>
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
        </div>

        <ProgressBar value={order.progress} status={order.status} />

        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar size={13} /> Dibuat: {order.createdAt}
          </span>
          <span style={{ fontSize: 12, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 5 }}>
            <Clock size={13} /> Target: {order.estimatedCompletion}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #F3F4F6", background: "#F9FAFB", padding: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            <div>
              <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
                <FileText size={15} color="#3B82F6" /> Detail Proyek
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Deskripsi">{order.description}</Field>
                <Field label="Skill Dibutuhkan">{order.skills}</Field>
                {order.additionalNotes && <Field label="Catatan Tambahan">{order.additionalNotes}</Field>}
              </div>
            </div>

            <div>
              <h4 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center", gap: 6 }}>
                <User size={15} color="#3B82F6" /> Informasi Kontak
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Field label="Nama Kontak">
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><User size={13} color="#6B7280" /> {order.contactName}</span>
                </Field>
                <Field label="Nomor Telepon">
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={13} color="#6B7280" /> {order.contactPhone}</span>
                </Field>
              </div>

              <div style={{
                marginTop: 20, padding: "14px 16px",
                background: canPay ? "#EFF6FF" : "#F8FAFC",
                borderRadius: 12,
                border: `1px solid ${canPay ? "#BFDBFE" : "#E2E8F0"}`,
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, color: canPay ? "#3B82F6" : "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {canPay ? "Harga yang Ditetapkan Admin" : "Menunggu Penetapan Harga"}
                </p>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: canPay ? "#1D4ED8" : "#94A3B8" }}>
                  {order.planPriceRange || "Admin belum menetapkan harga"}
                </p>
              </div>

              {canPay && (
                <button
                  onClick={(e) => { e.stopPropagation(); onPay(order); }}
                  disabled={payLoading}
                  style={{
                    marginTop: 14, width: "100%", padding: "13px",
                    borderRadius: 12, border: "none",
                    background: payLoading ? "#94A3B8" : "linear-gradient(90deg, #3B82F6, #6366F1)",
                    color: "#fff", fontSize: 14, fontWeight: 700,
                    cursor: payLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "opacity 0.2s",
                  }}
                >
                  <CreditCard size={16} />
                  {payLoading ? "Memproses..." : `Bayar Sekarang — ${order.planPriceRange}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  const { createTransaction, openSnapPayment } = usePayment();

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await API.get("/project/my");
      setOrders(transformBackendData(data.data || data));
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── handle bayar ──
  const handlePay = async (order) => {
    setPayLoading(true);
    try {
      await loadMidtrans(); // ← load Midtrans hanya saat mau bayar

      const result = await createTransaction(order.id, {
        amount: 500000,
        customerName: order.contactName,
        customerEmail: "",
        customerPhone: order.contactPhone,
      });

      if (!result.success) {
        alert(result.message || "Gagal membuat transaksi");
        return;
      }

      openSnapPayment(
        result.data.snap_token,
        () => { alert("Pembayaran berhasil! Tim kami akan segera menghubungi Anda."); fetchOrders(); },
        () => { alert("Pembayaran pending. Silakan selesaikan pembayaran Anda."); },
        () => { alert("Pembayaran gagal. Silakan coba lagi."); },
      );
    } catch (err) {
      alert("Terjadi kesalahan saat memproses pembayaran");
    } finally {
      setPayLoading(false);
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    process: orders.filter((o) => o.status === "process").length,
    done: orders.filter((o) => o.status === "done").length,
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, border: "3px solid #E5E7EB", borderTop: "3px solid #3B82F6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#6B7280", fontSize: 14, margin: 0 }}>Memuat data orderan…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", textAlign: "center", maxWidth: 380, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <XCircle size={48} color="#EF4444" style={{ marginBottom: 16 }} />
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111827" }}>Gagal Memuat Data</h2>
          <p style={{ margin: "0 0 24px", color: "#6B7280", fontSize: 14 }}>{error}</p>
          <button onClick={fetchOrders} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 10, border: "none", cursor: "pointer", background: "#3B82F6", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            <RefreshCw size={15} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", padding: "32px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" }}>Orderan Saya</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280" }}>Pantau status dan progress semua proyek Anda</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard icon={Layers} label="Total Orderan" value={stats.total} color="#3B82F6" />
          <StatCard icon={Clock} label="Menunggu" value={stats.pending} color="#F59E0B" />
          <StatCard icon={TrendingUp} label="Dalam Proses" value={stats.process} color="#6366F1" />
          <StatCard icon={CheckCircle} label="Selesai" value={stats.done} color="#22C55E" />
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FILTER_ORDER.map((s) => {
            const active = filterStatus === s;
            return (
              <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 500, background: active ? "#3B82F6" : "#F3F4F6", color: active ? "#fff" : "#374151", transition: "all 0.15s" }}>
                {s === "all" ? "Semua" : STATUS[s]?.label || s}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredOrders.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 16, padding: "64px 24px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <Package size={48} color="#D1D5DB" style={{ marginBottom: 16 }} />
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#6B7280" }}>Belum ada orderan</p>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: "#9CA3AF" }}>Orderan Anda akan muncul di sini</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrder === order.id}
                onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                onPay={handlePay}
                payLoading={payLoading}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default OrderDashboard;