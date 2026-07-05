-- Note: The auth.users table is managed by Supabase Auth and its rows must be 
-- inserted either via the Supabase Auth API or using the appropriate Supabase 
-- dashboard UI. To make seeding work smoothly, please sign up two users in the 
-- app first (e.g. admin@wawo.com and staf@wawo.com).
--
-- Then, copy their user IDs from auth.users and replace the placeholders below.
-- For example:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@wawo.com';
-- UPDATE public.users SET role = 'staf' WHERE email = 'staf@wawo.com';

-- Assuming users are created and we know an Admin UUID to act as 'input_by'
-- DO $$ 
-- DECLARE
--   admin_uuid UUID := 'YOUR-ADMIN-USER-ID-HERE';
-- BEGIN

-- Insert Dummy Alat Medis
INSERT INTO public.alat_medis (nama_alat, jenis_alat, jumlah, status, catatan) VALUES
('Jarum Suntik 3ml', 'Bahan Habis Pakai', 500, 'Tersedia', 'Stok bulanan'),
('Perban Elastis 5cm', 'Bahan Habis Pakai', 200, 'Tersedia', 'Penyimpanan lemari A'),
('Botol Infus RL 500ml', 'Cairan', 150, 'Tersedia', 'Kadaluarsa tahun depan'),
('Termometer Digital', 'Alat Diagnostik', 5, 'Tersedia', 'Dikalibrasi bulan lalu'),
('Stetoskop Dewasa', 'Alat Diagnostik', 3, 'Tersedia', 'Kondisi baik'),
('Tensi Meter Aneroid', 'Alat Diagnostik', 4, 'Tersedia', 'Perlu kalibrasi 1 unit'),
('Kapas Alkohol', 'Bahan Habis Pakai', 1000, 'Tersedia', 'Baru masuk'),
('Plester Roll', 'Bahan Habis Pakai', 50, 'Menipis', 'Segera pesan ulang'),
('Gunting Bedah', 'Alat Bedah Minor', 10, 'Tersedia', 'Besi tahan karat'),
('Pinset Anatomis', 'Alat Bedah Minor', 15, 'Tersedia', 'Disterilkan rutin');

-- Insert Dummy Log Laporan
-- Replace the UUIDs in alat_id and petugas_id with valid IDs from your database
-- INSERT INTO public.log_laporan (alat_id, tipe_transaksi, jumlah, petugas_id) VALUES
-- ((SELECT id FROM public.alat_medis WHERE nama_alat = 'Jarum Suntik 3ml' LIMIT 1), 'masuk', 100, admin_uuid),
-- ((SELECT id FROM public.alat_medis WHERE nama_alat = 'Jarum Suntik 3ml' LIMIT 1), 'keluar', 20, admin_uuid),
-- ((SELECT id FROM public.alat_medis WHERE nama_alat = 'Termometer Digital' LIMIT 1), 'rusak', 1, admin_uuid),
-- ((SELECT id FROM public.alat_medis WHERE nama_alat = 'Botol Infus RL 500ml' LIMIT 1), 'keluar', 10, admin_uuid),
-- ((SELECT id FROM public.alat_medis WHERE nama_alat = 'Perban Elastis 5cm' LIMIT 1), 'masuk', 50, admin_uuid);

-- END $$;
