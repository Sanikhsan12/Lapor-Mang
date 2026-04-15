# Lapor Mang 📣

<div align="center">

![Lapor Mang Banner](https://img.shields.io/badge/Lapor%20Mang-Platform%20Pelaporan%20Kesehatan-4ade80?style=for-the-badge)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-010101?style=flat-square&logo=socket.io)](https://socket.io/)

**Pilih Bahasa / Select Language / 言語を選択:**  
🇮🇩 [Indonesia](#-indonesia) · 🇬🇧 [English](#-english) · 🇯🇵 [日本語](#-日本語)

</div>

---

## 🇮🇩 Indonesia

### Tentang Aplikasi

**Lapor Mang** adalah platform pelaporan masalah kesehatan publik berbasis web yang memungkinkan warga melaporkan keluhan kesehatan secara mudah, cepat, dan transparan. Setiap laporan yang masuk akan diterima oleh admin secara _real-time_ dan ditindaklanjuti sesegera mungkin.

### Fitur Utama

- 🏠 **Landing Page** — Halaman sambutan dengan penjelasan manfaat platform
- 🔐 **Autentikasi** — Sistem login & registrasi dengan JWT (role: `user` & `admin`)
- 📝 **Buat Laporan** — User dapat membuat laporan dengan judul, deskripsi, foto bukti, dan nomor HP yang dapat dihubungi
- 🗜️ **Kompresi Gambar Otomatis** — Foto dikompresi di sisi klien sebelum diunggah
- 📊 **Dashboard User** — Melihat semua laporan yang pernah dibuat beserta status dan balasan admin
- 🛡️ **Dashboard Admin** — Memantau semua laporan, memperbarui status, dan mengirim balasan ke pelapor
- ⚡ **Real-time Socket.io** — Laporan baru dan pembaruan status muncul secara langsung tanpa refresh
- 👥 **Stat User Online** — Admin dapat melihat jumlah koneksi aktif secara live
- 🌙 **Dark / Light Mode** — Toggle tema tersedia di seluruh halaman

### Tech Stack

| Layer    | Teknologi                                                       |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, socket.io-client |
| Backend  | Node.js, Express 5, Prisma ORM, socket.io, Multer, bcrypt, JWT  |
| Database | PostgreSQL 15                                                   |
| DevOps   | Docker, Docker Compose                                          |

### Cara Menjalankan

**Prasyarat:** Docker & Docker Compose sudah terinstall.

```bash
# 1. Clone repository
git clone <url-repo>
cd lapor-mang

# 2. Jalankan semua service dengan Docker
docker-compose up --build

# Akses:
# Frontend  → http://localhost:8080
# Backend   → http://localhost:5000
# Database  → localhost:5432
```

> ⚠️ Untuk mereset database (misal setelah perubahan schema):
>
> ```bash
> docker-compose down -v
> docker-compose up --build
> ```

### Struktur Proyek

```
lapor-mang/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Skema database
│   ├── src/
│   │   ├── core/               # DB & Socket.io init
│   │   ├── middlewares/        # Auth, upload, error handler
│   │   └── modules/
│   │       ├── auth/           # Login & Register
│   │       └── reports/        # CRUD laporan
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/           # Halaman Login
│   │   │   ├── landing/        # Landing Page
│   │   │   └── reports/        # Dashboard User & Admin
│   │   └── shared/             # Context, utils
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🇬🇧 English

### About

**Lapor Mang** is a web-based public health reporting platform that empowers citizens to report health-related issues easily, quickly, and transparently. Every incoming report is received by an admin in _real-time_ and addressed as soon as possible.

### Key Features

- 🏠 **Landing Page** — Welcome screen with platform overview and benefits
- 🔐 **Authentication** — Login & registration system using JWT (roles: `user` & `admin`)
- 📝 **Create Reports** — Users can submit reports with title, description, photo evidence, and a contact phone number
- 🗜️ **Auto Image Compression** — Photos are automatically compressed on the client side before upload
- 📊 **User Dashboard** — View all submitted reports with status tracking and admin replies
- 🛡️ **Admin Dashboard** — Monitor all reports, update statuses, and send responses to reporters
- ⚡ **Real-time via Socket.io** — New reports and status updates appear instantly without page refresh
- 👥 **Live Online User Count** — Admin can see the number of active connections in real-time
- 🌙 **Dark / Light Mode** — Theme toggle available across all pages

### Tech Stack

| Layer    | Technology                                                      |
| -------- | --------------------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS v4, React Router, socket.io-client |
| Backend  | Node.js, Express 5, Prisma ORM, socket.io, Multer, bcrypt, JWT  |
| Database | PostgreSQL 15                                                   |
| DevOps   | Docker, Docker Compose                                          |

### Getting Started

**Prerequisites:** Docker & Docker Compose must be installed.

```bash
# 1. Clone the repository
git clone <repo-url>
cd lapor-mang

# 2. Start all services with Docker
docker-compose up --build

# Access:
# Frontend  → http://localhost:8080
# Backend   → http://localhost:5000
# Database  → localhost:5432
```

> ⚠️ To reset the database (e.g., after schema changes):
>
> ```bash
> docker-compose down -v
> docker-compose up --build
> ```

### Project Structure

```
lapor-mang/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── core/               # DB & Socket.io init
│   │   ├── middlewares/        # Auth, upload, error handler
│   │   └── modules/
│   │       ├── auth/           # Login & Register
│   │       └── reports/        # Report CRUD
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/           # Login Page
│   │   │   ├── landing/        # Landing Page
│   │   │   └── reports/        # User & Admin Dashboard
│   │   └── shared/             # Context, utils
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🇯🇵 日本語

### アプリについて

**Lapor Mang**は、市民が健康に関する問題を簡単・迅速・透明性をもって報告できるWebベースの公衆衛生報告プラットフォームです。送信された報告はすべて管理者に*リアルタイム*で届き、迅速に対応されます。

### 主な機能

- 🏠 **ランディングページ** — プラットフォームの概要とメリットを紹介するウェルカム画面
- 🔐 **認証機能** — JWTを使用したログイン＆登録システム（ロール：`user` ＆ `admin`）
- 📝 **報告書作成** — タイトル、説明、写真証拠、連絡先電話番号を含む報告書を投稿可能
- 🗜️ **自動画像圧縮** — アップロード前にクライアント側で写真を自動圧縮
- 📊 **ユーザーダッシュボード** — 自分の報告書、ステータス、管理者からの返信を一覧表示
- 🛡️ **管理者ダッシュボード** — すべての報告書の監視、ステータス更新、報告者への返信送信
- ⚡ **Socket.ioによるリアルタイム通信** — ページリフレッシュなしで新しい報告とステータス更新を即時表示
- 👥 **オンラインユーザー数（ライブ）** — 管理者がアクティブな接続数をリアルタイムで確認可能
- 🌙 **ダーク / ライトモード** — 全ページでテーマ切り替えが可能

### 技術スタック

| レイヤー       | 技術                                                            |
| -------------- | --------------------------------------------------------------- |
| フロントエンド | React 19, Vite, Tailwind CSS v4, React Router, socket.io-client |
| バックエンド   | Node.js, Express 5, Prisma ORM, Socket.io, Multer, bcrypt, JWT  |
| データベース   | PostgreSQL 15                                                   |
| インフラ       | Docker, Docker Compose                                          |

### 実行方法

**前提条件：** DockerとDocker Composeがインストール済みであること。

```bash
# 1. リポジトリをクローン
git clone <リポジトリURL>
cd lapor-mang

# 2. Dockerですべてのサービスを起動
docker-compose up --build

# アクセス先：
# フロントエンド → http://localhost:8080
# バックエンド   → http://localhost:5000
# データベース   → localhost:5432
```

> ⚠️ データベースをリセットする場合（スキーマ変更後など）：
>
> ```bash
> docker-compose down -v
> docker-compose up --build
> ```

### プロジェクト構造

```
lapor-mang/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # データベーススキーマ
│   ├── src/
│   │   ├── core/               # DB & Socket.io 初期化
│   │   ├── middlewares/        # 認証・アップロード・エラーハンドラー
│   │   └── modules/
│   │       ├── auth/           # ログイン & 登録
│   │       └── reports/        # 報告書CRUD
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/           # ログインページ
│   │   │   ├── landing/        # ランディングページ
│   │   │   └── reports/        # ユーザー & 管理者ダッシュボード
│   │   └── shared/             # Context, utils
│   └── Dockerfile
└── docker-compose.yml
```

---

<div align="center">

Lapor Mang © 2026

</div>
