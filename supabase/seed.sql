-- CATATAN PENTING: 
-- Tabel `users` kita memiliki foreign key ke `auth.users` Supabase.
-- Dalam skenario nyata, user harus didaftarkan melalui Authentication API (Sign Up), 
-- lalu menggunakan trigger otomatis untuk mengisi tabel public.users.
-- Untuk testing manual, Anda bisa menyesuaikan UUID di bawah dengan UUID dari user di Supabase Auth Anda.

-- 1. Dummy Users
INSERT INTO users (id, nama, email, role) VALUES 
  ('d1a3c638-4e3a-4a25-8d9e-123456789012', 'Admin Wawo', 'admin@wawo.com', 'admin'),
  ('f2b4d749-5f4b-5b36-9eaf-234567890123', 'Staf Medis 1', 'staf1@wawo.com', 'staf');

-- 2. Dummy Alat Medis Padat
INSERT INTO alat_medis (id, nama_alat, jenis_alat, jumlah, status, catatan, input_by) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Jarum Suntik 3cc', 'Habis Pakai', 500, 'Baik', 'Stok bulanan rutin', 'd1a3c638-4e3a-4a25-8d9e-123456789012'),
  ('a2222222-2222-2222-2222-222222222222', 'Jarum Suntik 5cc', 'Habis Pakai', 300, 'Baik', 'Stok bulanan', 'f2b4d749-5f4b-5b36-9eaf-234567890123'),
  ('a3333333-3333-3333-3333-333333333333', 'Kasa Steril 16x16', 'Perban', 150, 'Baik', 'Kondisi baik, segel aman', 'd1a3c638-4e3a-4a25-8d9e-123456789012'),
  ('a4444444-4444-4444-4444-444444444444', 'Plester Roll', 'Perban', 50, 'Baik', 'Tersedia di gudang utama', 'f2b4d749-5f4b-5b36-9eaf-234567890123'),
  ('a5555555-5555-5555-5555-555555555555', 'Infus Set Dewasa', 'Set Infus', 200, 'Baik', 'Stok utama IGD', 'd1a3c638-4e3a-4a25-8d9e-123456789012'),
  ('a6666666-6666-6666-6666-666666666666', 'Infus Set Anak', 'Set Infus', 100, 'Baik', 'Stok utama IGD', 'd1a3c638-4e3a-4a25-8d9e-123456789012'),
  ('a7777777-7777-7777-7777-777777777777', 'Termometer Digital', 'Alat Ukur', 15, 'Baik', 'Kalibrasi terakhir Jan 2023', 'f2b4d749-5f4b-5b36-9eaf-234567890123'),
  ('a8888888-8888-8888-8888-888888888888', 'Tensimeter Digital', 'Alat Ukur', 5, 'Baik', 'Kondisi normal', 'd1a3c638-4e3a-4a25-8d9e-123456789012'),
  ('a9999999-9999-9999-9999-999999999999', 'Stetoskop', 'Alat Periksa', 8, 'Baik', 'Kondisi baik', 'f2b4d749-5f4b-5b36-9eaf-234567890123'),
  ('a0000000-0000-0000-0000-000000000000', 'Kursi Roda', 'Alat Bantu', 2, 'Rusak', 'Roda depan macet, butuh servis', 'd1a3c638-4e3a-4a25-8d9e-123456789012');

-- 3. Dummy Log Laporan
INSERT INTO log_laporan (alat_id, tipe_transaksi, jumlah, petugas_id, waktu_lapor) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'masuk', 100, 'd1a3c638-4e3a-4a25-8d9e-123456789012', NOW() - INTERVAL '5 days'),
  ('a1111111-1111-1111-1111-111111111111', 'keluar', 20, 'f2b4d749-5f4b-5b36-9eaf-234567890123', NOW() - INTERVAL '4 days'),
  ('a5555555-5555-5555-5555-555555555555', 'masuk', 50, 'd1a3c638-4e3a-4a25-8d9e-123456789012', NOW() - INTERVAL '3 days'),
  ('a0000000-0000-0000-0000-000000000000', 'rusak', 1, 'f2b4d749-5f4b-5b36-9eaf-234567890123', NOW() - INTERVAL '2 days'),
  ('a7777777-7777-7777-7777-777777777777', 'keluar', 2, 'f2b4d749-5f4b-5b36-9eaf-234567890123', NOW() - INTERVAL '1 days');
