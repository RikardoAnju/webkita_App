import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import API from "../../utils/api";
import { transformProject, transformUser } from "../../utils/adminConstants";
import AdminSidebar from "./AdminSidebar";
import StatsGrid from "./StatsGrid";
import OrdersTable from "./OrdersTable";
import UsersTable from "./UsersTable";
import TransactionsTable from "./TransactionsTable";

const TopBar = ({ title, subtitle, onRefresh, loading }) => (
  <div style={{
    padding: "20px 28px",
    borderBottom: "1px solid #F1F5F9",
    display: "flex", alignItems: "center",
    justifyContent: "space-between", gap: 12,
    background: "#fff",
  }}>
    <div>
      <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{title}</h1>
      {subtitle && <p style={{ margin: "3px 0 0", fontSize: 13, color: "#94A3B8" }}>{subtitle}</p>}
    </div>
    <button
      onClick={onRefresh}
      disabled={loading}
      style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 9,
        border: "1px solid #E2E8F0", background: "#fff",
        fontSize: 13, fontWeight: 500, color: "#374151",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      <RefreshCw size={13} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
      Refresh
    </button>
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

const ErrorBanner = ({ message, onRetry }) => (
  <div style={{
    margin: "24px 28px 0",
    padding: "14px 18px", borderRadius: 12,
    background: "#FEF2F2", border: "1px solid #FECACA",
    display: "flex", alignItems: "center", gap: 10,
  }}>
    <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
    <span style={{ fontSize: 13, color: "#991B1B", flex: 1 }}>{message}</span>
    <button
      onClick={onRetry}
      style={{
        padding: "5px 12px", borderRadius: 7, border: "1px solid #FECACA",
        background: "#fff", color: "#EF4444", fontSize: 12,
        fontWeight: 600, cursor: "pointer",
      }}
    >
      Coba lagi
    </button>
  </div>
);

const Skeleton = ({ h = 16, w = "100%", r = 6 }) => (
  <div style={{
    height: h, width: w, borderRadius: r,
    background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  }} />
);

const AdminDashboard = () => {
  const [page,         setPage]         = useState("dashboard");
  const [orders,       setOrders]       = useState([]);
  const [users,        setUsers]        = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, usersRes, txRes] = await Promise.all([
        API.get("/project"),
        API.get("/users"),
        API.get("/payments/all"),
      ]);
      setOrders((ordersRes.data || ordersRes).map(transformProject));
      setUsers((usersRes.data  || usersRes).map(transformUser));
      setTransactions(txRes.data ?? []);
    } catch (err) {
      setError(err?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  const PAGE_META = {
    dashboard:    { title: "Dashboard",         subtitle: "Ringkasan aktivitas platform Webkita"    },
    orders:       { title: "Manajemen Orderan",  subtitle: `${orders.length} orderan terdaftar`      },
    users:        { title: "Manajemen Pengguna", subtitle: `${users.length} pengguna terdaftar`      },
    transactions: { title: "Transaksi",          subtitle: `${transactions.length} transaksi tercatat` },
  };

  const meta = PAGE_META[page];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      <AdminSidebar
        active={page}
        onChange={setPage}
        onLogout={handleLogout}
        orderCount={orders.length}
        userCount={users.length}
        transactionCount={transactions.length}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          onRefresh={fetchAll}
          loading={loading}
        />

        {error && <ErrorBanner message={error} onRetry={fetchAll} />}

        <div style={{ padding: "24px 28px", flex: 1 }}>

          {/* ── DASHBOARD ── */}
          {page === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #F1F5F9" }}>
                      <Skeleton h={12} w="60%" r={4} />
                      <div style={{ height: 12 }} />
                      <Skeleton h={28} w="40%" r={6} />
                    </div>
                  ))}
                </div>
              ) : (
                <StatsGrid orders={orders} users={users} />
              )}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Orderan Terbaru</h2>
                  <button
                    onClick={() => setPage("orders")}
                    style={{ fontSize: 12, fontWeight: 600, color: "#3B82F6", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    Lihat semua →
                  </button>
                </div>
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "14px 18px", border: "1px solid #F1F5F9" }}>
                        <Skeleton h={13} w="45%" r={4} />
                        <div style={{ height: 8 }} />
                        <Skeleton h={11} w="25%" r={4} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <OrdersTable orders={orders.slice(0, 5)} onRefresh={fetchAll} />
                )}
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {page === "orders" && (
            loading
              ? <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {Array(6).fill(0).map((_, i) => <Skeleton key={i} h={14} r={4} />)}
                  </div>
                </div>
              : <OrdersTable orders={orders} onRefresh={fetchAll} />
          )}

          {/* ── USERS ── */}
          {page === "users" && (
            loading
              ? <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {Array(6).fill(0).map((_, i) => <Skeleton key={i} h={14} r={4} />)}
                  </div>
                </div>
              : <UsersTable users={users} />
          )}

          {/* ── TRANSACTIONS ── */}
          {page === "transactions" && (
            loading
              ? <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {Array(6).fill(0).map((_, i) => <Skeleton key={i} h={14} r={4} />)}
                  </div>
                </div>
              : <TransactionsTable transactions={transactions} onRefresh={fetchAll} />
          )}

        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        * { box-sizing: border-box }
      `}</style>
    </div>
  );
};

export default AdminDashboard;