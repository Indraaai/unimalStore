# Product Requirements Document (PRD)
# Unimal Store — Platform Marketplace Kampus

**Versi:** 1.0  
**Tanggal:** Agustus 2026  
**Status:** In Development  
**Tech Stack:** Next.js 16 · React 19 · PostgreSQL · Prisma · NextAuth · Tailwind CSS · shadcn/ui

---

## 1. Ringkasan Produk

**Unimal Store** adalah platform marketplace berbasis web yang dikhususkan untuk lingkungan kampus (Universitas Malikussaleh / Unimal). Platform ini menghubungkan **penjual (seller)** dari kalangan mahasiswa dan civitas akademika dengan pembeli potensial dalam ekosistem kampus, memungkinkan transaksi produk fisik maupun jasa secara digital.

### Problem Statement
Mahasiswa dan pelaku UMKM kampus kesulitan mempromosikan produk/jasa mereka secara terpusat. Tidak ada platform yang berfokus pada komunitas kampus Unimal sehingga potensi ekonomi kampus belum termaksimalkan.

### Solusi
Marketplace terpusat dengan sistem verifikasi penjual, manajemen produk/layanan, fitur iklan berbayar (featured ads), dan sistem membership berjenjang.

---

## 2. Target Pengguna

| Peran | Deskripsi |
|-------|-----------|
| **Seller (Penjual)** | Mahasiswa/civitas kampus yang ingin menjual produk atau menawarkan jasa |
| **Admin** | Pengelola platform yang memverifikasi seller, moderasi konten, dan kelola sistem |
| **Pengunjung/Pembeli** | Pengguna umum yang menelusuri dan menghubungi seller via WhatsApp |

---

## 3. Arsitektur Sistem

### 3.1 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL |
| ORM | Prisma v7 (dengan adapter `@prisma/adapter-pg`) |
| Autentikasi | NextAuth v4 (JWT Strategy, Credentials Provider) |
| Validasi | Zod v4 |
| Password Hashing | bcryptjs |

### 3.2 Struktur Aplikasi

```
app/
├── (auth)/
│   ├── login/          # Halaman login (SELLER & ADMIN)
│   └── register/       # Halaman registrasi Seller
├── (dashboard)/
│   ├── admin/
│   │   └── dashboard/  # Dashboard Admin
│   ├── seller/
│   │   └── dashboard/  # Dashboard Seller
│   └── user/           # (Placeholder – belum dikembangkan)
└── api/
    └── auth/           # NextAuth API handler
```

### 3.3 Role & Akses

| Role | Akses |
|------|-------|
| `SELLER` | `/seller/*` — Dashboard seller, manajemen produk, pembayaran |
| `ADMIN` | `/admin/*` — Verifikasi seller, moderasi produk, kelola membership |

Route protection dikelola melalui **Next.js Middleware** (`middleware.ts`) berbasis JWT token role.

---

## 4. Data Model (Database Schema)

### 4.1 Entitas Utama

#### `User`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | cuid | Primary key |
| `name` | String | Nama lengkap |
| `email` | String (unique) | Email login |
| `password` | String | Bcrypt hashed |
| `role` | `SELLER \| ADMIN` | Default: `SELLER` |
| `status` | `ACTIVE \| SUSPENDED` | Default: `ACTIVE` |

#### `SellerProfile`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `storeName` | String | Nama toko |
| `storeSlug` | String (unique) | URL-friendly store identifier |
| `whatsappNumber` | String | Nomor WA untuk leads (format 62xxx) |
| `description` | String? | Deskripsi singkat toko |
| `logoUrl` | String? | URL logo toko |
| `status` | SellerStatus | `PENDING_VERIFICATION \| ACTIVE \| SUSPENDED \| REJECTED` |

#### `Product`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `title` | String | Nama produk/jasa |
| `slug` | String (unique) | URL-friendly |
| `description` | String | Deskripsi lengkap |
| `price` | Int | Harga dalam Rupiah (IDR) |
| `type` | `PRODUCT \| SERVICE` | Jenis listing |
| `status` | ProductStatus | `DRAFT \| PENDING \| PUBLISHED \| REJECTED \| ARCHIVED` |
| `isFeatured` | Boolean | Apakah produk di-promote |
| `featuredUntil` | DateTime? | Masa aktif featured |
| `viewsCount` | Int | Jumlah total tayangan |
| `leadsCount` | Int | Jumlah klik kontak WA |

#### `MembershipPlan`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `name` | String | Nama paket |
| `price` | Int | Harga paket (IDR) |
| `durationDays` | Int | Durasi membership (hari) |
| `productLimit` | Int | Batas jumlah produk aktif |
| `canUseFeaturedAds` | Boolean | Apakah bisa gunakan featured ads |

#### `Payment`
| Field | Tipe | Keterangan |
|-------|------|------------|
| `type` | `MEMBERSHIP \| FEATURED_ADS` | Jenis pembayaran |
| `amount` | Int | Nominal (IDR) |
| `proofImageUrl` | String? | Bukti transfer |
| `status` | PaymentStatus | `PENDING \| AWAITING_VERIFICATION \| APPROVED \| REJECTED \| EXPIRED` |
| `adminNote` | String? | Catatan admin saat review |

---

## 5. Fitur yang Sudah Ada (Implemented)

### ✅ F-01: Autentikasi (Auth)
- **Login** (`/login`) — email + password via NextAuth Credentials Provider
- **Registrasi Seller** (`/register`) — pendaftaran seller baru dengan validasi Zod
- **JWT Session** — role disimpan dalam token JWT
- **Route Protection** — middleware melindungi `/admin/*` dan `/seller/*`
- **Auto-redirect** — login ADMIN → `/admin/dashboard`, SELLER → `/seller/dashboard`

### ✅ F-02: Registrasi Seller
Form registrasi mencakup field:
- Nama lengkap, Email, Password (min. 6 karakter)
- Nama Toko, Nomor WhatsApp (format 62xxx), Deskripsi Toko
- Auto-generate `storeSlug` dari nama toko
- Status awal: `PENDING_VERIFICATION` (menunggu persetujuan admin)
- Redirect ke `/login?registered=success` setelah berhasil

### ✅ F-03: Dashboard Placeholder
- Admin Dashboard (`/admin/dashboard`) — halaman konfirmasi login admin
- Seller Dashboard (`/seller/dashboard`) — halaman konfirmasi login seller + tombol logout

---

## 6. Fitur yang Perlu Dikembangkan (Backlog)

### 🔲 F-04: Admin — Manajemen Seller
- Daftar semua seller dengan filter status (`PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `REJECTED`)
- Aksi: **Verifikasi** (approve) / **Tolak** (reject) dengan catatan
- Aksi: **Suspend** / **Aktifkan** seller
- Detail profil seller

### 🔲 F-05: Admin — Manajemen Produk
- Daftar semua produk dengan filter status (`PENDING`, `PUBLISHED`, `REJECTED`, dll.)
- Aksi: **Approve** / **Reject** produk baru (status `PENDING`)
- Moderasi konten tidak sesuai

### 🔲 F-06: Admin — Manajemen Membership Plan
- CRUD paket membership (nama, harga, durasi, batas produk, akses featured ads)
- Aktifkan / nonaktifkan paket

### 🔲 F-07: Admin — Verifikasi Pembayaran
- Daftar pembayaran masuk (`AWAITING_VERIFICATION`)
- Lihat bukti transfer
- Aksi: **Approve** / **Reject** dengan catatan admin

### 🔲 F-08: Seller — Manajemen Produk
- CRUD produk/jasa (judul, deskripsi, harga, kategori, foto)
- Upload multiple gambar (model `ProductImage`)
- Draft / publish produk (sesuai batas paket membership)
- Lihat status review admin

### 🔲 F-09: Seller — Langganan Membership
- Pilih paket membership yang tersedia
- Upload bukti pembayaran manual (transfer bank)
- Lihat status pembayaran

### 🔲 F-10: Seller — Featured Ads
- Promote produk tertentu sebagai featured (jika paket membership mendukung)
- Upload bukti pembayaran featured ads
- Lihat `featuredUntil` (masa aktif featured)

### 🔲 F-11: Seller — Statistik & Analitik
- Dashboard: total produk, total views, total leads
- Detail views per produk (model `ProductView`)
- Detail leads per produk (model `Lead`)

### 🔲 F-12: Halaman Publik — Katalog Produk
- Landing page dengan daftar produk published
- Filter berdasarkan kategori, tipe (produk/jasa)
- Sorting: terbaru, harga, popularitas
- Featured products di bagian atas
- Pencarian produk

### 🔲 F-13: Halaman Publik — Detail Produk
- Informasi lengkap produk + galeri foto
- Tombol **"Hubungi via WhatsApp"** (generate link WA → catat sebagai `Lead`)
- Tracking views otomatis saat halaman dibuka (model `ProductView`)
- Info profil seller

### 🔲 F-14: Halaman Publik — Profil Toko Seller
- Halaman publik toko berdasarkan `storeSlug` (`/toko/[storeSlug]`)
- Logo, nama toko, deskripsi
- Daftar produk aktif dari seller tersebut

### 🔲 F-15: Manajemen Kategori (Admin)
- CRUD kategori produk (model `Category`: nama, slug, deskripsi)
- Aktifkan / nonaktifkan kategori

---

## 7. User Flow Utama

### 7.1 Alur Seller Baru
```
Registrasi → PENDING_VERIFICATION
    ↓ (Admin review)
ACTIVE ← Admin approve
    ↓
Seller pilih & bayar Membership
    ↓ (Upload bukti, admin verifikasi)
Membership ACTIVE
    ↓
Seller tambah Produk (limit sesuai paket)
    ↓ (Admin moderasi)
Produk PUBLISHED → tampil di katalog publik
```

### 7.2 Alur Pembeli (Pengunjung)
```
Lihat katalog publik
    ↓
Buka detail produk (views dicatat)
    ↓
Klik "Hubungi via WhatsApp" (lead dicatat)
    ↓
Chat langsung dengan seller di WhatsApp
```

### 7.3 Alur Featured Ads
```
Seller (dengan paket yang mendukung featured ads)
    ↓
Pilih produk → request featured
    ↓
Upload bukti bayar → AWAITING_VERIFICATION
    ↓ (Admin approve)
Produk isFeatured=true, featuredUntil=set
    ↓
Produk muncul di posisi prioritas katalog
```

---

## 8. Business Rules

| # | Aturan |
|---|--------|
| BR-01 | Seller baru harus melewati verifikasi admin sebelum bisa listing produk |
| BR-02 | Seller hanya bisa menambah produk sebanyak `productLimit` dari paket membership aktif |
| BR-03 | Featured Ads hanya bisa digunakan jika paket membership memiliki `canUseFeaturedAds = true` |
| BR-04 | Produk baru masuk status `PENDING` dan menunggu moderasi admin |
| BR-05 | Pembayaran menggunakan metode transfer manual + upload bukti |
| BR-06 | Lead (klik WA) dan View dicatat per produk dengan IP address dan user agent |
| BR-07 | Seller yang di-suspend tidak bisa login |
| BR-08 | `storeSlug` di-generate otomatis dari nama toko, dengan suffix timestamp jika duplikat |
| BR-09 | Nomor WhatsApp harus dalam format internasional dengan prefix 62 |

---

## 9. Non-Functional Requirements

| # | Kebutuhan | Detail |
|---|-----------|--------|
| NFR-01 | **Keamanan** | Password di-hash dengan bcrypt (cost 10), JWT untuk session |
| NFR-02 | **Validasi** | Server-side validation dengan Zod pada semua form input |
| NFR-03 | **Otorisasi** | Middleware-level route protection berdasarkan JWT role |
| NFR-04 | **Performa** | Server Actions untuk mutation, tidak ada full page reload |
| NFR-05 | **Responsif** | UI mobile-friendly (TailwindCSS responsive utilities) |
| NFR-06 | **Database** | PostgreSQL dengan Prisma ORM + connection pooling via `@prisma/adapter-pg` |

---

## 10. Status Pengembangan

| Modul | Status | Keterangan |
|-------|--------|------------|
| Auth (Login) | ✅ Done | Sepenuhnya berfungsi |
| Auth (Register Seller) | ✅ Done | Sepenuhnya berfungsi |
| Middleware & Route Protection | ✅ Done | Sepenuhnya berfungsi |
| Database Schema | ✅ Done | Schema lengkap tersedia |
| Admin Dashboard | 🔄 Placeholder | Halaman kosong, perlu dikembangkan |
| Seller Dashboard | 🔄 Placeholder | Halaman kosong, perlu dikembangkan |
| Manajemen Produk (Seller) | ❌ Belum | Perlu dibangun |
| Manajemen Produk (Admin) | ❌ Belum | Perlu dibangun |
| Manajemen Seller (Admin) | ❌ Belum | Perlu dibangun |
| Membership Plan | ❌ Belum | Perlu dibangun |
| Sistem Pembayaran | ❌ Belum | Perlu dibangun |
| Featured Ads | ❌ Belum | Perlu dibangun |
| Halaman Publik / Katalog | ❌ Belum | Perlu dibangun |
| Detail Produk Publik | ❌ Belum | Perlu dibangun |
| Profil Toko Publik | ❌ Belum | Perlu dibangun |
| Statistik Seller | ❌ Belum | Perlu dibangun |
| Kategori (Admin) | ❌ Belum | Perlu dibangun |

---

## 11. Prioritas Pengembangan (Roadmap)

### Phase 1 — Core Dashboard (Prioritas Tinggi)
1. Layout dashboard dengan sidebar navigasi (Admin & Seller)
2. Admin: Halaman verifikasi seller
3. Admin: Manajemen kategori
4. Seller: Halaman profil toko

### Phase 2 — Produk & Membership
5. Admin: Manajemen paket membership
6. Seller: Upload & kelola produk (CRUD + gambar)
7. Admin: Moderasi produk
8. Seller: Langganan membership (upload bukti)
9. Admin: Verifikasi pembayaran

### Phase 3 — Halaman Publik
10. Landing page / katalog produk
11. Detail produk + tracking leads & views
12. Halaman publik profil toko seller
13. Pencarian & filter produk

### Phase 4 — Featured Ads & Analitik
14. Featured Ads flow (seller request + admin approve)
15. Dashboard statistik seller (views, leads, produk)
16. Dashboard analitik admin (total transaksi, revenue)

---

## 12. Struktur Direktori Proyek

```
unimalstore/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth routes (login, register)
│   ├── (dashboard)/        # Protected dashboard routes
│   └── api/                # API routes (NextAuth)
├── components/             # Shared UI components
│   └── ui/                 # shadcn/ui base components
├── features/               # Feature-based server actions
│   └── auth/               # Auth actions
├── lib/                    # Utilities & configs
│   ├── auth.ts             # NextAuth config
│   ├── prisma.ts           # Prisma client singleton
│   └── session.ts          # Session helpers
├── prisma/                 # Database
│   ├── schema.prisma       # Data model
│   └── seed.ts             # Seed admin user
├── schemas/                # Zod validation schemas
│   └── auth/               # Auth schemas
├── services/               # (Placeholder – service layer)
├── stores/                 # (Placeholder – state management)
└── types/                  # TypeScript type extensions
    └── next-auth.d.ts      # NextAuth type augmentation
```

---

*Dokumen ini dibuat berdasarkan analisis kode sumber proyek Unimal Store per Agustus 2026.*
