import { supabase } from "../lib/supabaseClient";

export type AlatMedis = {
  id: string;
  nama_alat: string;
  jenis_alat: string;
  jumlah: number;
  status: "Baik" | "Rusak" | "Habis";
  catatan?: string;
  input_by?: string;
  created_at?: string;
  updated_at?: string;
};

// Fallback dummy data if Supabase is not configured yet (for UI preview)
let mockData: AlatMedis[] = [
  {
    id: "1",
    nama_alat: "Jarum Suntik 3cc",
    jenis_alat: "Habis Pakai",
    jumlah: 500,
    status: "Baik",
  },
  {
    id: "2",
    nama_alat: "Kasa Steril 16x16",
    jenis_alat: "Perban",
    jumlah: 150,
    status: "Baik",
  },
  {
    id: "3",
    nama_alat: "Kursi Roda",
    jenis_alat: "Alat Bantu",
    jumlah: 2,
    status: "Rusak",
    catatan: "Roda macet",
  },
];

export const getAlatMedis = async (): Promise<AlatMedis[]> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    return Promise.resolve(mockData); // Return mock data if credentials aren't set
  }

  const { data, error } = await supabase
    .from("alat_medis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as AlatMedis[];
};

export const createAlatMedis = async (
  alat: Omit<AlatMedis, "id" | "created_at" | "updated_at">,
): Promise<AlatMedis> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    const newAlat = {
      ...alat,
      id: Math.random().toString(),
      created_at: new Date().toISOString(),
    };
    mockData = [newAlat, ...mockData];
    return Promise.resolve(newAlat);
  }

  const { data, error } = await supabase
    .from("alat_medis")
    .insert([alat])
    .select()
    .single();

  if (error) throw error;
  return data as AlatMedis;
};

export const updateAlatMedis = async (
  id: string,
  updates: Partial<AlatMedis>,
): Promise<AlatMedis> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    mockData = mockData.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
    return Promise.resolve(mockData.find((item) => item.id === id)!);
  }

  const { data, error } = await supabase
    .from("alat_medis")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as AlatMedis;
};

export const deleteAlatMedis = async (id: string): Promise<void> => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    mockData = mockData.filter((item) => item.id !== id);
    return Promise.resolve();
  }

  const { error } = await supabase.from("alat_medis").delete().eq("id", id);

  if (error) throw error;
};

export const getDashboardStats = async () => {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    const totalAlat = mockData.length;
    const stokMenipis = mockData.filter((item) => item.status === "Habis" || item.jumlah < 50).length;
    return Promise.resolve({
      totalAlat,
      stokMenipis,
      alatKeluar: 20, // Dummy
      efisiensi: 94.2, // Dummy
    });
  }

  const { count: totalAlat, error: countError } = await supabase
    .from("alat_medis")
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  const { count: stokMenipis, error: stokError } = await supabase
    .from("alat_medis")
    .select("*", { count: "exact", head: true })
    .or("status.eq.Habis,jumlah.lt.50");

  if (stokError) throw stokError;

  const { count: alatKeluar, error: keluarError } = await supabase
    .from("log_laporan")
    .select("*", { count: "exact", head: true })
    .eq("tipe_transaksi", "keluar")
    .gte(
      "waktu_lapor",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    );

  if (keluarError) console.error(keluarError);

  return {
    totalAlat: totalAlat || 0,
    stokMenipis: stokMenipis || 0,
    alatKeluar: alatKeluar || 0,
    efisiensi: 94.2, // Placeholder
  };
};
