import React from "react";
import { Package, Clock, TrendingUp, CheckCircle, Users, XCircle } from "lucide-react";

const Card = ({ icon: Icon, label, value, sub, color }) => (
  <div style={{
    background: "#fff",
    borderRadius: 14,
    padding: "20px 22px",
    border: "1px solid #F1F5F9",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#64748B" }}>{label}</span>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={18} color={color} />
      </div>
    </div>
    <div>
      <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0F172A", lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94A3B8" }}>{sub}</p>}
    </div>
  </div>
);

const StatsGrid = ({ orders, users }) => {
  const total     = orders.length;
  const pending   = orders.filter(o => o.status === "pending").length;
  const process   = orders.filter(o => o.status === "process").length;
  const done      = orders.filter(o => o.status === "done").length;
  const rejected  = orders.filter(o => o.status === "rejected").length;
  const totalUsers = users.length;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 16,
    }}>
      <Card icon={Package}     label="Total Orderan"  value={total}      sub={`${rejected} ditolak`}   color="#3B82F6" />
      <Card icon={Clock}       label="Menunggu"        value={pending}    sub="perlu ditinjau"          color="#F59E0B" />
      <Card icon={TrendingUp}  label="Diproses"        value={process}    sub="sedang berjalan"         color="#8B5CF6" />
      <Card icon={CheckCircle} label="Selesai"         value={done}       sub="berhasil"                color="#10B981" />
      <Card icon={Users}       label="Total User"      value={totalUsers} sub="terdaftar"               color="#06B6D4" />
    </div>
  );
};

export default StatsGrid;