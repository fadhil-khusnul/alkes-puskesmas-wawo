# SIMALKES - Sistem Informasi Pengelolaan Alat Medis Puskesmas Wawo

SIMALKES adalah aplikasi berbasis web dengan kemampuan **Progressive Web App (PWA)** yang dirancang khusus untuk mengelola inventarisasi, pencatatan log penggunaan, serta pelaporan alat medis di Puskesmas Wawo, Kabupaten Bima, Nusa Tenggara Barat (NTB). 

Aplikasi ini dilengkapi dengan landing page dinamis yang informatif serta modul admin panel terintegrasi untuk menyesuaikan isi konten (headline jumbotron, slideshow gambar, deskripsi manfaat, profil puskesmas) secara real-time langsung melalui database.

---

## 🚀 Fitur Utama

- **Progressive Web App (PWA)**: Dapat diinstal langsung di layar utama smartphone Android/iOS atau desktop, berjalan lancar secara mandiri (*standalone window*) tanpa bilah navigasi browser.
- **Dynamic Jumbotron & Landing Page**: Halaman muka yang bersih dengan navigasi dinamis, slideshow otomatis, profil puskesmas, dan grid manfaat.
- **Landing Page CMS / Settings Panel**: Panel admin khusus untuk mengubah konten landing page dan slider gambar tanpa menyentuh source code.
- **Manajemen Inventaris Alat Medis**: CRUD lengkap alat medis beserta pemantauan status kelayakan.
- **Log Pelaporan & Audit Trail**: Pencatatan riwayat penambahan, modifikasi, dan penghapusan data secara historis.
- **Role-Based Access Control (RBAC)**: Pembatasan akses fitur untuk Administrator dan Staf Puskesmas.

---

## 🛠️ Prasyarat Sistem

Pastikan perangkat Anda sudah terinstal perangkat lunak berikut:
- **Node.js** (Versi 18.x atau yang lebih baru)
- **Laragon** (Dengan MySQL Server aktif)
- **Git**
- **Ngrok** (Untuk kebutuhan testing PWA di perangkat HP/Mobile)

---

## 📋 Langkah Instalasi & Pengoperasian

Ikuti langkah-langkah di bawah ini untuk menjalankan project di lingkungan lokal (*development*):

### 1. Clone Repositori
Buka terminal/command prompt Anda, lalu jalankan perintah berikut:
```bash
git clone https://github.com/username-anda/alkes-puskesmas-wawo.git
cd alkes-puskesmas-wawo
```

### 2. Instal Dependensi Node.js
Pasang semua pustaka yang dibutuhkan oleh project Next.js ini:
```bash
npm install
```

### 3. Buat Database Baru di Laragon (MySQL)
1. Jalankan **Laragon**, lalu klik tombol **Start All**.
2. Buka aplikasi manajemen database Anda (seperti HeidiSQL, phpMyAdmin, atau DBeaver).
3. Buat database baru bernama: `alkes_puskesmas_wawo`.
4. Duplikat file `.env.example` di root project menjadi `.env`, lalu sesuaikan baris koneksi database:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/alkes_puskesmas_wawo"
   NEXT_PUBLIC_APP_ENV="development"
   ```

### 4. Sinkronisasi Skema Prisma & Seeding
Jalankan perintah-perintah berikut untuk membuat tabel database dan mengisinya dengan data demonstrasi (dummy data):
```bash
# Generate Prisma Client
npx prisma generate

# Sinkronisasi skema ke database MySQL Laragon Anda
npx prisma db push

# Menjalankan database seed (Membuat Akun Admin, Staf, Data Alat Medis awal, & Setting Landing Page)
npx prisma db seed
```
> **Default Login Credentials (Dev/Demo Mode)**:
> - **Email**: `admin@wawo.id` | **Password**: `admin123`
> - **Email**: `staf@wawo.id` | **Password**: `staf123`

### 5. Jalankan Development Server
Mulai jalankan server lokal Next.js:
```bash
npm run dev
```
Aplikasi sekarang dapat diakses secara lokal di browser melalui: [http://localhost:3000](http://localhost:3000).

---

## 📱 Petunjuk Pengujian PWA di Handphone (Mobile) menggunakan Ngrok

Agar fitur PWA installer muncul di handphone Anda, koneksi harus berjalan di protokol aman **HTTPS** atau dianggap aman oleh browser. Anda dapat menggunakan **Ngrok** untuk mengekspos localhost ke publik secara aman.

### Langkah-Langkah Ekspos Port Lokal:
1. Pastikan server local Anda tetap berjalan (`npm run dev` aktif di port `3000`).
2. Jalankan perintah ngrok di jendela terminal baru:
   ```bash
   ngrok http 3000
   ```
3. Salin alamat HTTPS publik yang dihasilkan oleh Ngrok, contoh: `https://abcd-123-45.ngrok-free.app`.
4. Buka tautan HTTPS tersebut di browser Google Chrome / Safari handphone Anda.

### Mengatasi Kendala PWA Service Worker (Security Redirect):
Bila Anda menghadapi error keamanan registrasi Service Worker (seperti `SecurityError: Failed to register a ServiceWorker... behind a redirect`) saat menggunakan domain publik HTTP/HTTPS ngrok:

1. Buka browser **Google Chrome** di handphone Anda.
2. Masuk ke halaman bendera konfigurasi chrome dengan mengetikkan:
   ```text
   chrome://flags
   ```
3. Cari opsi: **"Insecure origins treated as secure"**.
4. Aktifkan (*Enable*) opsi tersebut, lalu masukkan URL Ngrok Anda ke dalam kotak input teks di bawahnya (contoh: `http://abcd-123-45.ngrok-free.app` atau alamat HTTPS-nya).
5. Klik tombol **Relaunch / Restart Chrome** di pojok kanan bawah browser HP Anda.
6. Akses kembali URL Ngrok Anda. Tombol/Notifikasi instalan aplikasi PWA ("Tambahkan ke Layar Utama" / "Instal Aplikasi") sekarang akan muncul dan berjalan secara mandiri sebagai standalone app di homescreen handphone Anda.

---

## 📁 Struktur Folder Utama
- `/app` - Halaman utama, router, dan API server actions Next.js.
- `/components` - Kumpulan komponen UI modular (Sidebar, Navbar, Hero slider, dll).
- `/prisma` - Konfigurasi ORM Prisma database schema (`schema.prisma`) dan file data seed (`seed.ts`).
- `/public` - Aset statis seperti gambar, ikon manifest, dan PWA file configuration.
