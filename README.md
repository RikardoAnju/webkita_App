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