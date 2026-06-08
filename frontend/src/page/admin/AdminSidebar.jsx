import React, { useState } from "react";
import { LayoutDashboard, Package, Users, LogOut, ChevronRight, Menu, X, CreditCard } from "lucide-react";

const NAV = [
  { id: "dashboard",    label: "Dashboard",   icon: LayoutDashboard },
  { id: "orders",       label: "Orderan",      icon: Package          },
  { id: "users",        label: "Pengguna",     icon: Users            },
  { id: "transactions", label: "Transaksi",    icon: CreditCard       },
];

const AdminSidebar = ({ active, onChange, onLogout, orderCount, userCount, transactionCount }) => {
  const [collapsed, setCollapsed] = useState(false);
  const counts = { orders: orderCount, users: userCount, transactions: transactionCount };

  return (
    <>
      <aside style={{
        width: collapsed ? 64 : 220,
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #F1F5F9",
        display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 12px",
          borderBottom: "1px solid #F8FAFC",
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 8,
        }}>
          {!collapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>W</span>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>Webkita</p>
                <p style={{ margin: 0, fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid #E2E8F0", background: "#F8FAFC",
              cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0, color: "#64748B",
            }}
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            const count    = counts[id];
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                title={collapsed ? label : undefined}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: collapsed ? 0 : 10,
                  padding: collapsed ? "10px 0" : "9px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 10, border: "none",
                  cursor: "pointer", marginBottom: 2,
                  background: isActive ? "#EFF6FF" : "transparent",
                  color:      isActive ? "#2563EB" : "#64748B",
                  textAlign: "left", transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
                      {label}
                    </span>
                    {count != null && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: "2px 6px", borderRadius: 20,
                        background: isActive ? "#DBEAFE" : "#F1F5F9",
                        color:      isActive ? "#2563EB" : "#94A3B8",
                      }}>
                        {count}
                      </span>
                    )}
                    {isActive && <ChevronRight size={13} />}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "12px 8px", borderTop: "1px solid #F8FAFC" }}>
          <button
            onClick={onLogout}
            title={collapsed ? "Keluar" : undefined}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: collapsed ? 0 : 10,
              padding: collapsed ? "10px 0" : "9px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none",
              cursor: "pointer", background: "transparent", color: "#EF4444",
              textAlign: "left", transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <LogOut size={16} />
            {!collapsed && (
              <span style={{ fontSize: 13, fontWeight: 500 }}>Keluar</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;