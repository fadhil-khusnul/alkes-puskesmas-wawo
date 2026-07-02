-- 1. Create custom Enums
CREATE TYPE user_role AS ENUM ('admin', 'staf');
CREATE TYPE status_alat AS ENUM ('Baik', 'Rusak', 'Habis');
CREATE TYPE tipe_transaksi AS ENUM ('masuk', 'keluar', 'rusak');

-- 2. Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'staf',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE alat_medis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_alat VARCHAR(255) NOT NULL,
    jenis_alat VARCHAR(100) NOT NULL,
    jumlah INT DEFAULT 0 CHECK (jumlah >= 0),
    status status_alat DEFAULT 'Baik',
    catatan TEXT,
    input_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE log_laporan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alat_id UUID REFERENCES alat_medis(id) ON DELETE CASCADE,
    tipe_transaksi tipe_transaksi NOT NULL,
    jumlah INT NOT NULL,
    petugas_id UUID REFERENCES users(id) ON DELETE SET NULL,
    waktu_lapor TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE alat_medis ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_laporan ENABLE ROW LEVEL SECURITY;

-- 4. Basic RLS Policies
-- NOTE: In production, these should be restricted based on user role from `auth.uid()`.
CREATE POLICY "Allow authenticated users to read users" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read alat_medis" ON alat_medis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert alat_medis" ON alat_medis FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update alat_medis" ON alat_medis FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to delete alat_medis" ON alat_medis FOR DELETE TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to read log_laporan" ON log_laporan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert log_laporan" ON log_laporan FOR INSERT TO authenticated WITH CHECK (true);
