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

export const getAlatMedis = async (): Promise<AlatMedis[]> => {
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
  const { data: userData } = await supabase.auth.getUser();
  const input_by = userData?.user?.id;

  const { data, error } = await supabase
    .from("alat_medis")
    .insert([{ ...alat, input_by }])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message || "Failed to create alat medis");
  }
  return data as AlatMedis;
};

export const updateAlatMedis = async (
  id: string,
  updates: Partial<AlatMedis>,
): Promise<AlatMedis> => {
  const { data, error } = await supabase
    .from("alat_medis")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error(error.message || "Failed to update alat medis");
  }
  return data as AlatMedis;
};

export const deleteAlatMedis = async (id: string): Promise<void> => {
  const { error } = await supabase.from("alat_medis").delete().eq("id", id);

  if (error) throw error;
};

export const getDashboardStats = async () => {
  const { count: totalAlat, error: countError } = await supabase
    .from("alat_medis")
    .select("*", { count: "exact", head: true });

  if (countError) throw countError;

  const { count: stokMenipis, error: stokError } = await supabase
    .from("alat_medis")
    .select("*", { count: "exact", head: true })
    .or("status.eq.Habis,jumlah.lt.50");

  if (stokError) throw stokError;

  const { count: totalPengguna, error: usersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if (usersError) console.error(usersError);

  const { data: allAlat, error: allAlatError } = await supabase
    .from("alat_medis")
    .select("jenis_alat, jumlah");

  if (allAlatError) throw allAlatError;

  const chartDataMap: Record<string, number> = {};
  allAlat?.forEach((alat) => {
    if (alat.jenis_alat) {
      chartDataMap[alat.jenis_alat] = (chartDataMap[alat.jenis_alat] || 0) + (alat.jumlah || 0);
    }
  });

  const chartData = Object.entries(chartDataMap).map(([name, jumlah]) => ({
    name,
    jumlah,
  }));

  return {
    totalAlat: totalAlat || 0,
    stokMenipis: stokMenipis || 0,
    totalPengguna: totalPengguna || 0,
    efisiensi: 94.2, // Placeholder
    chartData,
  };
};

