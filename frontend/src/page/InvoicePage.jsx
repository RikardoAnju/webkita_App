import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle, Building2, User, Phone, Mail, Calendar, Hash } from "lucide-react";

import API from "../utils/api";

const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  const num = typeof value === "string" ? parseInt(value.replace(/\D/g, "")) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateString) => {
  if (!dateString) return "–";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const InvoicePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [project, setProject] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectRes, paymentRes] = await Promise.all([
          API.get(`/project/${projectId}`),
          API.get(`/payment/project/${projectId}`),
        ]);
        setProject(projectRes?.data || projectRes);
        setPayment(paymentRes?.data || paymentRes);
      } catch (err) {
        setError(err?.message || "Gagal memuat data invoice");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  const handleDownload = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #invoice-print, #invoice-print * { visibility: visible; }
        #invoice-print { position: fixed; top: 0; left: 0; width: 100%; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #E5E7EB", borderTop: "3px solid #3B82F6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#6B7280", fontSize: 14 }}>Memuat invoice…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", textAlign: "center", maxWidth: 380 }}>
          <p style={{ color: "#EF4444", fontWeight: 700, marginBottom: 16 }}>{error}</p>
          <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const invoiceNumber = `INV-${String(projectId).padStart(4, "0")}-${new Date().getFullYear()}`;
  const isPaid = payment?.isPaid === true;
  const amount = project?.plan_price_range;

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6", padding: "32px 16px" }}>
      {/* Toolbar */}
      <div className="no-print" style={{ maxWidth: 760, margin: "0 auto 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151" }}
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        <button
          onClick={handleDownload}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 20px", background: "linear-gradient(90deg, #3B82F6, #6366F1)", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#fff" }}
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      {/* Invoice */}
      <div
        id="invoice-print"
        ref={printRef}
        style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", padding: "40px 48px", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>Webkita</h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75 }}>Hubungkan bisnis Anda dengan developer terbaik</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Invoice</p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800 }}>{invoiceNumber}</p>
              <div style={{
                marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 14px", borderRadius: 20,
                background: isPaid ? "rgba(34,197,94,0.2)" : "rgba(251,191,36,0.2)",
                border: `1px solid ${isPaid ? "rgba(34,197,94,0.5)" : "rgba(251,191,36,0.5)"}`,
              }}>
                {isPaid && <CheckCircle size={13} color="#4ADE80" />}
                <span style={{ fontSize: 12, fontWeight: 700, color: isPaid ? "#4ADE80" : "#FCD34D" }}>
                  {isPaid ? "LUNAS" : "MENUNGGU PEMBAYARAN"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "40px 48px" }}>

          {/* Dates row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: 36, paddingBottom: 32, borderBottom: "1px solid #F3F4F6" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={11} /> Tanggal Invoice
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{formatDate(new Date().toISOString())}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={11} /> Tanggal Proyek
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{formatDate(project?.created_at)}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5 }}>
                <Hash size={11} /> ID Proyek
              </p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>#{projectId}</p>
            </div>
          </div>

          {/* From / To */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 36 }}>
            <div>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Dari</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1E3A8A, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Webkita</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>webkita.com</p>
                </div>
              </div>
            </div>

            <div>
              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Kepada</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={18} color="#6B7280" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{project?.contact_name || "–"}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                    <Phone size={11} /> {project?.contact_phone || "–"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Project detail */}
          <div style={{ background: "#F9FAFB", borderRadius: 14, padding: "24px 28px", marginBottom: 32, border: "1px solid #F3F4F6" }}>
            <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, color: "#374151" }}>Rincian Proyek</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ textAlign: "left", padding: "8px 0", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Deskripsi</th>
                  <th style={{ textAlign: "center", padding: "8px 0", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Paket</th>
                  <th style={{ textAlign: "right", padding: "8px 0", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "16px 0", verticalAlign: "top" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{project?.project_title || "–"}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280" }}>{project?.category}</p>
                  </td>
                  <td style={{ padding: "16px 0", textAlign: "center", verticalAlign: "top" }}>
                    <span style={{ padding: "4px 12px", borderRadius: 20, background: "#EFF6FF", color: "#3B82F6", fontSize: 12, fontWeight: 700 }}>
                      {project?.plan_title || "–"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 0", textAlign: "right", verticalAlign: "top" }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#111827" }}>{formatRupiah(amount)}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 36 }}>
            <div style={{ minWidth: 280 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Subtotal</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{formatRupiah(amount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
                <span style={{ fontSize: 13, color: "#6B7280" }}>Pajak (0%)</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Rp 0</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0" }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#1D4ED8" }}>{formatRupiah(amount)}</span>
              </div>
            </div>
          </div>

          {/* Status banner */}
          {isPaid && (
            <div style={{
              background: "linear-gradient(90deg, #DCFCE7, #D1FAE5)",
              border: "1px solid #86EFAC",
              borderRadius: 12, padding: "16px 24px",
              display: "flex", alignItems: "center", gap: 12, marginBottom: 32,
            }}>
              <CheckCircle size={22} color="#16A34A" />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#15803D" }}>Pembayaran Telah Diterima</p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#16A34A" }}>Terima kasih! Pembayaran Anda telah berhasil dikonfirmasi.</p>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 24, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>
              Terima kasih telah mempercayakan proyek Anda kepada <strong>Webkita</strong>. Jika ada pertanyaan, hubungi kami di support@webkita.com
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvoicePage;