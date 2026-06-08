import React, { useState, useMemo } from "react";
import { Search, Shield, User as UserIcon } from "lucide-react";
import { formatDate } from "../../utils/adminConstants";

const PAGE_SIZE = 10;

const Th = ({ children }) => (
  <th style={{
    padding: "11px 14px", textAlign: "left",
    fontSize: 11, fontWeight: 700, color: "#94A3B8",
    textTransform: "uppercase", letterSpacing: 0.6,
    background: "#F8FAFC", whiteSpace: "nowrap",
    borderBottom: "1px solid #F1F5F9",
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

const Avatar = ({ name, size = 32 }) => {
  const initials = name
    ? name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "?";
  const colors = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];
  const color = colors[name?.charCodeAt(0) % colors.length] || "#3B82F6";

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${color}20`, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
};

const UsersTable = ({ users }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (users || []).filter(u =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  }, [users, search]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #F1F5F9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      overflow: "hidden",
    }}>
      {/* Toolbar */}
      <div style={{
        padding: "16px 20px",
        display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid #F8FAFC",
      }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
          <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama atau email..."
            style={{
              width: "100%", padding: "8px 12px 8px 32px",
              borderRadius: 9, border: "1px solid #E2E8F0",
              fontSize: 13, color: "#1E293B", outline: "none",
              background: "#F8FAFC", boxSizing: "border-box",
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: "auto" }}>
          {filtered.length} user
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Pengguna</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Bergabung</Th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "48px 0", color: "#94A3B8", fontSize: 14 }}>
                  Tidak ada user ditemukan
                </td>
              </tr>
            ) : paginated.map((user, i) => (
              <tr
                key={user.id}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Td style={{ color: "#94A3B8", fontSize: 12 }}>
                  {(page - 1) * PAGE_SIZE + i + 1}
                </Td>
                <Td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={user.name} />
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>{user.name}</span>
                  </div>
                </Td>
                <Td style={{ color: "#64748B" }}>{user.email}</Td>
                <Td>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
                    background: user.role === "admin" ? "#EDE9FE" : "#F1F5F9",
                    color: user.role === "admin" ? "#7C3AED" : "#475569",
                  }}>
                    {user.role === "admin"
                      ? <><Shield size={10} />Admin</>
                      : <><UserIcon size={10} />User</>
                    }
                  </span>
                </Td>
                <Td style={{ color: "#64748B", fontSize: 12 }}>
                  {formatDate(user.createdAt)}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: "12px 20px", borderTop: "1px solid #F8FAFC",
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4,
        }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                width: 30, height: 30, borderRadius: 7,
                border: n === page ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
                background: n === page ? "#EFF6FF" : "#fff",
                color: n === page ? "#3B82F6" : "#374151",
                fontWeight: n === page ? 700 : 400,
                fontSize: 13, cursor: "pointer",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersTable;