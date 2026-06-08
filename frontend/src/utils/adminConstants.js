// ─── Transform Functions ───────────────────────────────────────────────────────

export const transformProject = (item) => {
  const status = item.status || "pending";
  const planTitle = item.plan_title || item.PlanTitle || "";

  const planPriceRange =
    item.plan_price_range ||
    item.PlanPriceRange ||
    item.price_range ||
    item.PriceRange ||
    item.planPriceRange ||
    null;

  return {
    id: item.id || item.ID,
    userId: item.user_id || item.UserID,
    projectTitle: item.project_title || item.ProjectTitle || "–",
    category: item.category || "–",
    description: item.description || "–",
    skills: item.skills || "–",
    contactName: item.contact_name || item.ContactName || "–",
    contactPhone: item.contact_phone || item.ContactPhone || "–",
    additionalNotes: item.additional_notes || "",
    planTitle,
    priceRange: planPriceRange || PLAN_CONFIG[planTitle]?.price || "–",
    planPriceRange,
    status,
    createdAt: item.created_at || item.CreatedAt,
  };
};

export const transformUser = (item) => {
  const firstName = item.first_name || item.FirstName || "";
  const lastName = item.last_name || item.LastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || item.username || "–";

  return {
    id: item.id || item.ID,
    name: fullName,
    username: item.username || "–",
    email: item.email || item.Email || "–",
    phone: item.phone || item.Phone || "–",
    role: item.role || item.Role || "user",
    isAktif: item.is_aktif,
    createdAt: item.created_at || item.CreatedAt,
    avatar: item.avatar || item.Avatar || null,
  };
};

// ─── Status ───────────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "#D97706",
    bg: "#FEF3C7",
  },
  process: {
    label: "Process",
    color: "#059669",
    bg: "#D1FAE5",
  },
  approved: {
    label: "Approved",
    color: "#2563EB",
    bg: "#DBEAFE",
  },
  done: {
    label: "Done",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEE2E2",
  },
};

export const STATUS_ORDER = [
  "pending",
  "process",
  "approved",
  "done",
  "rejected",
];

// ─── Plan Config ──────────────────────────────────────────────────────────────

export const PLAN_CONFIG = {
  Basic: {
    label: "Basic",
    color: "#059669",
    bg: "#D1FAE5",
    price: "Rp 500.000 – Rp 1.500.000",
  },
  Standard: {
    label: "Standard",
    color: "#2563EB",
    bg: "#DBEAFE",
    price: "Rp 1.500.000 – Rp 5.000.000",
  },
  Premium: {
    label: "Premium",
    color: "#7C3AED",
    bg: "#EDE9FE",
    price: "Rp 5.000.000 – Rp 15.000.000",
  },
};

// ─── Format Helpers ───────────────────────────────────────────────────────────

export const formatDate = (dateStr) => {
  if (!dateStr) return "–";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateLong = (dateStr) => {
  if (!dateStr) return "–";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return "–";
  const number = typeof amount === "string"
    ? parseFloat(amount.replace(/[^0-9.-]/g, ""))
    : amount;
  if (isNaN(number)) return amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};