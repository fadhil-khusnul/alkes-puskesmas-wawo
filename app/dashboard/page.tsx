"use client";

import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/alatMedisService";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAlat: 0,
    stokMenipis: 0,
    totalPengguna: 0,
    efisiensi: 0,
    chartData: [] as { name: string; jumlah: number }[],
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // We can optionally fetch the role from the token or user table, here we just show a generic greeting or check local state if possible.
        // For simplicity, let's just grab from document.cookie or default
        const { supabase } = await import("../../lib/supabaseClient");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data: userRecord } = await supabase.from('users').select('role').eq('id', user.id).single();
           setUserRole(userRecord?.role || 'staf');
        } else {
           setUserRole('admin/staf'); // Demo mode fallback
        }
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
            Selamat Datang, anda berhasil login sebagai {userRole || "..."}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantauan real-time inventaris dan aktivitas peralatan medis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Pengguna Card */}
        <div className="bg-white p-6 pb-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-auto min-h-[160px]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">
              Total Pengguna
            </p>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-slate-900">
              {loading ? "..." : stats.totalPengguna.toLocaleString()}
            </h3>
            <p className="text-indigo-600 text-sm mt-2 font-bold">
              Staf Terdaftar
            </p>
          </div>
        </div>

        {/* Total Alat Medis Card */}
        <div className="bg-white p-6 pb-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-auto min-h-[160px]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">
              Total Alat Medis
            </p>
            <div className="p-3 bg-teal-50 rounded-lg text-teal-500">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-slate-900">
              {loading ? "..." : stats.totalAlat.toLocaleString()}
            </h3>
            <p className="text-teal-600 text-sm mt-2 font-bold">
              Terdata di sistem
            </p>
          </div>
        </div>

        {/* Stok Menipis Card */}
        <div className="bg-white p-6 pb-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-auto min-h-[160px]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">
              Stok Menipis
            </p>
            <div className="p-3 bg-rose-50 rounded-lg text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-auto">
            <h3 className="text-4xl font-bold text-slate-900">
              {loading ? "..." : stats.stokMenipis.toLocaleString()}
            </h3>
            <p className="text-rose-600 text-sm mt-2 font-bold">
              Membutuhkan perhatian segera
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-6">
          Jumlah Alat per Jenis
        </h2>
        <div className="h-80 w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center text-slate-400">
              Memuat grafik...
            </div>
          ) : stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="jumlah" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400">
              Tidak ada data alat medis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
