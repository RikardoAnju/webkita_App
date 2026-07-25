cat > README.md << 'EOF'
# WebKita

## Deskripsi Umum Project

WebKita adalah aplikasi web dengan arsitektur **decoupled / REST API**, memisahkan backend dan frontend secara independen:

- **Backend**: REST API dibangun dengan [Hono](https://hono.dev/) dan berjalan di [Cloudflare Workers](https://workers.cloudflare.com/), menggunakan [Supabase](https://supabase.com/) sebagai database & autentikasi.
- **Frontend**: Single Page Application dibangun dengan [React](https://react.dev/) + [Vite](https://vitejs.dev/) dan [Tailwind CSS](https://tailwindcss.com/).

> WebKita adalah platform marketplace yang menghubungkan pemilik bisnis dengan developer profesional untuk pengerjaan proyek website. Target pengguna utama meliputi pelaku bisnis yang membutuhkan jasa pengembangan website serta developer/freelancer yang ingin menawarkan jasanya secara terpercaya. Fitur utama platform ini mencakup sistem pencocokan (matching) klien dengan developer, manajemen proyek pihak ketiga yang aman, serta jaminan keamanan transaksi untuk memastikan proyek berjalan lancar dari awal hingga selesai.

---

## Tech Stack

| Layer     | Teknologi                              |
|-----------|-----------------------------------------|
| Backend   | Hono, Cloudflare Workers, Wrangler      |
| Database  | Supabase (PostgreSQL)                   |
| Frontend  | React, Vite, Tailwind CSS               |
| Auth      | JWT                                      |
| Dev Tools | Docker, Docker Compose                  |

---

## Struktur Folder

-WEBKITA-APPLICATION/
├── backend/ # REST API (Hono + Cloudflare Workers)
│ ├── src/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── middleware/
│ │ └── lib/
│ ├── .dev.vars # environment variable lokal (JANGAN commit)
│ └── wrangler.jsonc
├── frontend/ # Client app (React + Vite)
│ └── src/
├── docker-compose.yml
└── README.md

---

## Installation & Setup Guide

### Prasyarat

- Node.js v22 atau lebih baru
- Docker & Docker Compose (opsional, untuk menjalankan via container)
- Akun Supabase (untuk kredensial database)
- Wrangler CLI (untuk deploy ke Cloudflare Workers)

### 1. Clone Repository
git clone https://github.com/RikardoAnju/webkita_App.git
cd webkita_App

### 2. Menjalankan Tanpa Docker (manual)

**Backend:**
cd backend
npm install
npx wrangler dev

**Frontend:**
cd frontend
npm install
npm run dev

### 3. Deploy ke Cloudflare Workers (Backend)
cd backend
npx wrangler deploy


## Daftar Kontributor / Pengembang Project

| Nama | Peran | Kontak |
|------|-------|--------|
| Rikardo Anju SinAGA | Full Stack | anjo24696@gmail.com|