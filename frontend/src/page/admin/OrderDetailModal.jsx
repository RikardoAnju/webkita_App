import React, { useState, useEffect } from "react";
import { X, FileText, User, Phone, Tag, Paperclip, Download } from "lucide-react";
import { formatDateLong, PLAN_CONFIG } from "../../utils/adminConstants";
import API from "../../utils/api";
import StatusBadge from "./StatusBadge";
import StatusUpdater from "./StatusUpdater";

const Row = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </span>
    <span style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.6, wordBreak: "break-word" }}>
      {children}
    </span>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <div style={{
    background: "#F8FAFC", borderRadius: 12,
    border: "1px solid #F1F5F9", padding: "16px 18px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
      <Icon size={15} color="#3B82F6" />
      <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{title}</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  </div>
);

// ─── Format file size ─────────────────────────────────────────────────────────
const formatSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const OrderDetailModal = ({ order, onClose, onUpdated }) => {
  const [attachments, setAttachments] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (!order?.id) return;
    setLoadingFiles(true);
    API.get(`/attachments/${order.id}`)
      .then((res) => setAttachments(res.data ?? []))
      .catch(() => setAttachments([]))
      .finally(() => setLoadingFiles(false));
  }, [order?.id]);

  const handleDownload = async (attachment) => {
    try {
      const res = await API.get(`/attachments/download/${attachment.id}`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res);
      const a = document.createElement("a");
      a.href = url;
      a.download = attachment.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh file");
    }
  };

  if (!order) return null;
  const plan = PLAN_CONFIG[order.planTitle];

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)",
      }} />

      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 101,
        width: "min(680px, calc(100vw - 32px))",
        maxHeight: "85vh",
        background: "#fff", borderRadius: 20,
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #F1F5F9",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <StatusBadge status={order.status} />
              {order.planTitle && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                  background: plan?.bg || "#F1F5F9", color: plan?.color || "#374151",
                }}>
                  Paket {order.planTitle}
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0F172A", wordBreak: "break-word" }}>
              {order.projectTitle}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
              #{order.id} · {order.category} · Dibuat {formatDateLong(order.createdAt)}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid #E2E8F0",
            background: "#fff", cursor: "pointer", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={15} color="#64748B" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

          <Section icon={FileText} title="Detail Proyek">
            <Row label="Deskripsi">{order.description}</Row>
            <Row label="Skills">{order.skills}</Row>
            {order.additionalNotes && (
              <Row label="Catatan Tambahan">{order.additionalNotes}</Row>
            )}
          </Section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            <Section icon={User} title="Kontak">
              <Row label="Nama">{order.contactName}</Row>
              <Row label="Telepon">{order.contactPhone}</Row>
            </Section>
            <Section icon={Tag} title="Paket & Harga">
              <Row label="Paket">{order.planTitle || "–"}</Row>
              <Row label="Estimasi Harga">
                <span style={{ fontSize: 15, fontWeight: 700, color: "#3B82F6" }}>
                  {order.priceRange}
                </span>
              </Row>
            </Section>
          </div>

          {/* ── Lampiran ── */}
          <Section icon={Paperclip} title="Lampiran">
            {loadingFiles ? (
              <span style={{ fontSize: 13, color: "#94A3B8" }}>Memuat lampiran...</span>
            ) : attachments.length === 0 ? (
              <span style={{ fontSize: 13, color: "#94A3B8" }}>Tidak ada lampiran</span>
            ) : (
              attachments.map((att) => (
                <div key={att.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: 9,
                  background: "#fff", border: "1px solid #E2E8F0", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <FileText size={16} color="#3B82F6" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: "#0F172A",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {att.file_name}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>
                        {formatSize(att.file_size)} · {att.file_type}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(att)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      padding: "6px 12px", borderRadius: 7,
                      border: "1px solid #BFDBFE", background: "#EFF6FF",
                      color: "#3B82F6", fontSize: 12, fontWeight: 600,
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <Download size={13} />
                    Unduh
                  </button>
                </div>
              ))
            )}
          </Section>

        </div>

        {/* Footer */}
       
      </div>
    </>
  );
};

export default OrderDetailModal;