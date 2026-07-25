import React, { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, GripVertical } from "lucide-react";
import API from "../../core/utils/api_client";

// ── helpers ───────────────────────────────────────────────────────
const TIER_OPTIONS = ["starter", "basic", "professional", "enterprise"];

const TIER_COLOR = {
  starter:      { bg: "#F0FDF4", color: "#16A34A" },
  basic:        { bg: "#EFF6FF", color: "#2563EB" },
  professional: { bg: "#FAF5FF", color: "#7C3AED" },
  enterprise:   { bg: "#FFF7ED", color: "#EA580C" },
};

const EMPTY_FORM = {
  title: "", tier: "starter", min_price: "", max_price: "",
  price_range: "", description: "", sort_order: 0, is_active: true,
  features: [], not_included: [],
};

const inputStyle = {
  width: "100%", padding: "8px 11px", borderRadius: 8,
  border: "1px solid #E2E8F0", fontSize: 13, outline: "none",
  boxSizing: "border-box",
};
const labelStyle = {
  fontSize: 12, fontWeight: 600, color: "#374151",
  display: "block", marginBottom: 4,
};

// ── FeatureListEditor ─────────────────────────────────────────────
const FeatureListEditor = ({ label, items, onChange }) => {
  const add    = () => onChange([...items, { feature: "", sort_order: items.length }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const edit   = (i, val) => onChange(items.map((it, idx) => idx === i ? { ...it, feature: val } : it));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label style={labelStyle}>{label}</label>
        <button type="button" onClick={add} style={{
          fontSize: 11, fontWeight: 600, color: "#3B82F6",
          background: "none", border: "none", cursor: "pointer", padding: 0,
        }}>+ Tambah</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <GripVertical size={13} color="#CBD5E1" style={{ flexShrink: 0 }} />
            <input
              value={it.feature}
              onChange={e => edit(i, e.target.value)}
              placeholder="Nama fitur..."
              style={{ ...inputStyle, flex: 1 }}
            />
            <button type="button" onClick={() => remove(i)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#EF4444", padding: 2, display: "flex",
            }}>
              <X size={14} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ margin: 0, fontSize: 11, color: "#CBD5E1", fontStyle: "italic" }}>Belum ada item</p>
        )}
      </div>
    </div>
  );
};

// ── Modal Create / Edit ───────────────────────────────────────────
const Modal = ({ open, onClose, onSave, initial, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [err,  setErr]  = useState("");

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { ...initial, features: initial.features ?? [], not_included: initial.not_included ?? [] }
        : EMPTY_FORM
      );
      setErr("");
    }
  }, [open, initial]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.tier || !form.min_price || !form.max_price || !form.price_range) {
      setErr("Title, tier, min_price, max_price, dan price_range wajib diisi");
      return;
    }
    setErr("");
    await onSave(form);
  };

  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        {/* header */}
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid #F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
        }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
            {initial ? "Edit Paket" : "Tambah Paket"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          {err && (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: "#FEF2F2", border: "1px solid #FECACA",
              fontSize: 12, color: "#991B1B",
            }}>{err}</div>
          )}

          {/* Title & Tier */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="Starter Plan" />
            </div>
            <div>
              <label style={labelStyle}>Tier *</label>
              <select style={inputStyle} value={form.tier} onChange={e => set("tier", e.target.value)}>
                {TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Harga */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Min Price *</label>
              <input style={inputStyle} type="number" value={form.min_price} onChange={e => set("min_price", Number(e.target.value))} placeholder="500000" />
            </div>
            <div>
              <label style={labelStyle}>Max Price *</label>
              <input style={inputStyle} type="number" value={form.max_price} onChange={e => set("max_price", Number(e.target.value))} placeholder="1000000" />
            </div>
            <div>
              <label style={labelStyle}>Price Range Label *</label>
              <input style={inputStyle} value={form.price_range} onChange={e => set("price_range", e.target.value)} placeholder="500rb – 1jt" />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label style={labelStyle}>Deskripsi</label>
            <textarea
              style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
              value={form.description ?? ""}
              onChange={e => set("description", e.target.value)}
              placeholder="Cocok untuk..."
            />
          </div>

          {/* Sort order & is_active */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "end" }}>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input style={inputStyle} type="number" value={form.sort_order} onChange={e => set("sort_order", Number(e.target.value))} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", paddingBottom: 2 }}>
              <input
                type="checkbox" checked={form.is_active}
                onChange={e => set("is_active", e.target.checked)}
                style={{ width: 15, height: 15 }}
              />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Aktif</span>
            </label>
          </div>

          {/* Features */}
          <div style={{ padding: "14px 16px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #F1F5F9" }}>
            <FeatureListEditor
              label="✅ Fitur Termasuk"
              items={form.features}
              onChange={v => set("features", v)}
            />
          </div>

          {/* Not included */}
          <div style={{ padding: "14px 16px", borderRadius: 10, background: "#FFF7F7", border: "1px solid #FEE2E2" }}>
            <FeatureListEditor
              label="❌ Tidak Termasuk"
              items={form.not_included}
              onChange={v => set("not_included", v)}
            />
          </div>
        </div>

        {/* footer */}
        <div style={{
          padding: "14px 22px", borderTop: "1px solid #F1F5F9",
          display: "flex", justifyContent: "flex-end", gap: 10,
          position: "sticky", bottom: 0, background: "#fff",
        }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 9, border: "1px solid #E2E8F0",
            background: "#fff", fontSize: 13, fontWeight: 500, color: "#374151", cursor: "pointer",
          }}>Batal</button>
          <button onClick={handleSave} disabled={loading} style={{
            padding: "8px 18px", borderRadius: 9, border: "none",
            background: loading ? "#93C5FD" : "#3B82F6",
            fontSize: 13, fontWeight: 700, color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── DeleteConfirm ─────────────────────────────────────────────────
const DeleteConfirm = ({ open, plan, onClose, onConfirm, loading }) => {
  if (!open || !plan) return null;
  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 14, width: "100%", maxWidth: 380,
        padding: "24px 24px 20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: "#FEF2F2",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
        }}>
          <Trash2 size={20} color="#EF4444" />
        </div>
        <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Hapus Paket?</h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748B" }}>
          Paket <strong>"{plan.title}"</strong> akan dihapus permanen beserta semua fiturnya.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            padding: "8px 18px", borderRadius: 9, border: "1px solid #E2E8F0",
            background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>Batal</button>
          <button onClick={onConfirm} disabled={loading} style={{
            padding: "8px 18px", borderRadius: 9, border: "none",
            background: loading ? "#FCA5A5" : "#EF4444",
            fontSize: 13, fontWeight: 700, color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── PricingTable ──────────────────────────────────────────────────
const PricingTable = ({ onRefresh: notifyParent }) => {
  const [plans,       setPlans]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [delLoading,  setDelLoading]  = useState(false);
  const [error,       setError]       = useState(null);
  const [modal,       setModal]       = useState({ open: false, data: null });
  const [delModal,    setDelModal]    = useState({ open: false, plan: null });

  const fetchPlans = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await API.get("/pricing");
      setPlans(res.data ?? res);
    } catch (e) {
      setError(e?.message || "Gagal memuat paket");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleSave = async (form) => {
    setSaveLoading(true);
    try {
      if (modal.data) {
        await API.put(`/pricing/${modal.data.id}`, form);
      } else {
        await API.post("/pricing", form);
      }
      setModal({ open: false, data: null });
      await fetchPlans();
      notifyParent?.();
    } catch (e) {
      alert(e?.message || "Gagal menyimpan");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await API.delete(`/pricing/${delModal.plan.id}`);
      setDelModal({ open: false, plan: null });
      await fetchPlans();
      notifyParent?.();
    } catch (e) {
      alert(e?.message || "Gagal menghapus");
    } finally {
      setDelLoading(false);
    }
  };

  const handleToggle = async (plan) => {
    try {
      await API.patch(`/pricing/${plan.id}/toggle-active`);
      await fetchPlans();
    } catch (e) {
      alert(e?.message || "Gagal mengubah status");
    }
  };

  if (loading) return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #F1F5F9" }}>
      {Array(4).fill(0).map((_, i) => (
        <div key={i} style={{
          height: 14, borderRadius: 4, marginBottom: 16,
          background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)",
          backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
        }} />
      ))}
    </div>
  );

  if (error) return (
    <div style={{ padding: "14px 18px", borderRadius: 12, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 13, color: "#991B1B" }}>
      {error} — <button onClick={fetchPlans} style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Coba lagi</button>
    </div>
  );

  return (
    <>
      {/* toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          onClick={() => setModal({ open: true, data: null })}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 16px", borderRadius: 10, border: "none",
            background: "#3B82F6", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          <Plus size={15} /> Tambah Paket
        </button>
      </div>

      {/* table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F1F5F9", overflow: "hidden" }}>
        {plans.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#CBD5E1", fontSize: 13 }}>
            Belum ada paket layanan
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                  {["#", "Title", "Tier", "Harga", "Price Range", "Fitur", "Status", "Aksi"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontWeight: 700, color: "#64748B", fontSize: 11, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => {
                  const tc = TIER_COLOR[plan.tier] ?? { bg: "#F1F5F9", color: "#64748B" };
                  return (
                    <tr
                      key={plan.id}
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {/* # */}
                      <td style={{ padding: "12px 14px", color: "#CBD5E1", fontWeight: 600 }}>{idx + 1}</td>

                      {/* Title */}
                      <td style={{ padding: "12px 14px" }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#0F172A" }}>{plan.title}</p>
                        {plan.description && (
                          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94A3B8", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {plan.description}
                          </p>
                        )}
                      </td>

                      {/* Tier */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.color }}>
                          {plan.tier}
                        </span>
                      </td>

                      {/* Harga */}
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap", color: "#374151" }}>
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>Rp </span>
                        {Number(plan.min_price).toLocaleString("id-ID")}
                        <span style={{ color: "#CBD5E1", margin: "0 4px" }}>–</span>
                        {Number(plan.max_price).toLocaleString("id-ID")}
                      </td>

                      {/* Price Range */}
                      <td style={{ padding: "12px 14px", color: "#64748B" }}>{plan.price_range}</td>

                      {/* Fitur */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>✅ {plan.features?.length ?? 0}</span>
                        <span style={{ margin: "0 6px", color: "#E2E8F0" }}>|</span>
                        <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>❌ {plan.not_included?.length ?? 0}</span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: plan.is_active ? "#DCFCE7" : "#F1F5F9",
                          color:      plan.is_active ? "#16A34A" : "#94A3B8",
                        }}>
                          {plan.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {/* Toggle */}
                          <button
                            onClick={() => handleToggle(plan)}
                            title={plan.is_active ? "Nonaktifkan" : "Aktifkan"}
                            style={{
                              padding: "5px 8px", borderRadius: 7, border: "1px solid #E2E8F0",
                              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                              color: plan.is_active ? "#16A34A" : "#94A3B8",
                            }}
                          >
                            {plan.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setModal({ open: true, data: plan })}
                            title="Edit"
                            style={{
                              padding: "5px 8px", borderRadius: 7, border: "1px solid #E2E8F0",
                              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", color: "#3B82F6",
                            }}
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDelModal({ open: true, plan })}
                            title="Hapus"
                            style={{
                              padding: "5px 8px", borderRadius: 7, border: "1px solid #FEE2E2",
                              background: "#FFF5F5", cursor: "pointer", display: "flex", alignItems: "center", color: "#EF4444",
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, data: null })}
        onSave={handleSave}
        initial={modal.data}
        loading={saveLoading}
      />
      <DeleteConfirm
        open={delModal.open}
        plan={delModal.plan}
        onClose={() => setDelModal({ open: false, plan: null })}
        onConfirm={handleDelete}
        loading={delLoading}
      />
    </>
  );
};

export default PricingTable;