import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  await prisma.logLaporan.deleteMany({});
  await prisma.alatMedis.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding users...');
  const admin = await prisma.user.create({
    data: {
      id: 'd1a3c638-4e3a-4a25-8d9e-123456789012',
      email: 'admin@wawo.com',
      nama: 'Admin Wawo',
      role: 'admin',
      password: 'password123',
    },
  });

  const staf = await prisma.user.create({
    data: {
      id: 'f2b4d749-5f4b-5b36-9eaf-234567890123',
      email: 'staf1@wawo.com',
      nama: 'Staf Medis 1',
      role: 'staf',
      password: 'password123',
    },
  });

  console.log('Seeding alat medis...');
  const items = [
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      nama_alat: 'Jarum Suntik 3cc',
      jenis_alat: 'Habis Pakai',
      jumlah: 500,
      status: 'Baik',
      catatan: 'Stok bulanan rutin',
      input_by: admin.id,
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      nama_alat: 'Jarum Suntik 5cc',
      jenis_alat: 'Habis Pakai',
      jumlah: 300,
      status: 'Baik',
      catatan: 'Stok bulanan',
      input_by: staf.id,
    },
    {
      id: 'a3333333-3333-3333-3333-333333333333',
      nama_alat: 'Kasa Steril 16x16',
      jenis_alat: 'Perban',
      jumlah: 150,
      status: 'Baik',
      catatan: 'Kondisi baik, segel aman',
      input_by: admin.id,
    },
    {
      id: 'a4444444-4444-4444-4444-444444444444',
      nama_alat: 'Plester Roll',
      jenis_alat: 'Perban',
      jumlah: 50,
      status: 'Baik',
      catatan: 'Tersedia di gudang utama',
      input_by: staf.id,
    },
    {
      id: 'a5555555-5555-5555-5555-555555555555',
      nama_alat: 'Infus Set Dewasa',
      jenis_alat: 'Set Infus',
      jumlah: 200,
      status: 'Baik',
      catatan: 'Stok utama IGD',
      input_by: admin.id,
    },
    {
      id: 'a6666666-6666-6666-6666-666666666666',
      nama_alat: 'Infus Set Anak',
      jenis_alat: 'Set Infus',
      jumlah: 100,
      status: 'Baik',
      catatan: 'Stok utama IGD',
      input_by: admin.id,
    },
    {
      id: 'a7777777-7777-7777-7777-777777777777',
      nama_alat: 'Termometer Digital',
      jenis_alat: 'Alat Ukur',
      jumlah: 15,
      status: 'Baik',
      catatan: 'Kalibrasi terakhir Jan 2023',
      input_by: staf.id,
    },
    {
      id: 'a8888888-8888-8888-8888-888888888888',
      nama_alat: 'Tensimeter Digital',
      jenis_alat: 'Alat Ukur',
      jumlah: 5,
      status: 'Baik',
      catatan: 'Kondisi normal',
      input_by: admin.id,
    },
    {
      id: 'a9999999-9999-9999-9999-999999999999',
      nama_alat: 'Stetoskop',
      jenis_alat: 'Alat Periksa',
      jumlah: 8,
      status: 'Baik',
      catatan: 'Kondisi baik',
      input_by: staf.id,
    },
    {
      id: 'a0000000-0000-0000-0000-000000000000',
      nama_alat: 'Kursi Roda',
      jenis_alat: 'Alat Bantu',
      jumlah: 2,
      status: 'Rusak',
      catatan: 'Roda depan macet, butuh servis',
      input_by: admin.id,
    },
  ];

  for (const item of items) {
    await prisma.alatMedis.create({ data: item });
  }

  console.log('Seeding log laporan...');
  const now = new Date();
  const getPastDate = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  const logs = [
    {
      alat_id: 'a1111111-1111-1111-1111-111111111111',
      tipe_transaksi: 'masuk',
      jumlah: 100,
      petugas_id: admin.id,
      waktu_lapor: getPastDate(5),
    },
    {
      alat_id: 'a1111111-1111-1111-1111-111111111111',
      tipe_transaksi: 'keluar',
      jumlah: 20,
      petugas_id: staf.id,
      waktu_lapor: getPastDate(4),
    },
    {
      alat_id: 'a5555555-5555-5555-5555-555555555555',
      tipe_transaksi: 'masuk',
      jumlah: 50,
      petugas_id: admin.id,
      waktu_lapor: getPastDate(3),
    },
    {
      alat_id: 'a0000000-0000-0000-0000-000000000000',
      tipe_transaksi: 'rusak',
      jumlah: 1,
      petugas_id: staf.id,
      waktu_lapor: getPastDate(2),
    },
    {
      alat_id: 'a7777777-7777-7777-7777-777777777777',
      tipe_transaksi: 'keluar',
      jumlah: 2,
      petugas_id: staf.id,
      waktu_lapor: getPastDate(1),
    },
  ];

  for (const log of logs) {
    await prisma.logLaporan.create({ data: log });
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
