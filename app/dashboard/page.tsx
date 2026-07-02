'use client';

import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../services/alatMedisService';
import { 
  Activity,
  AlertTriangle,
  ArrowDownRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalAlat: 0, stokMenipis: 0, alatKeluar: 0, efisiensi: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
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
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Ringkasan Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Pantauan real-time inventaris dan aktivitas peralatan medis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Alat Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
             <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Alat</p>
             <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><Activity className="w-4 h-4"/></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.totalAlat.toLocaleString()}
            </h3>
            <p className="text-teal-600 text-[10px] mt-1 font-bold">Terdata di sistem</p>
          </div>
        </div>

        {/* Stok Menipis Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Stok Menipis</p>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><AlertTriangle className="w-4 h-4"/></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-rose-600">
              {loading ? '...' : stats.stokMenipis.toLocaleString()}
            </h3>
            <p className="text-slate-400 text-[10px] mt-1 font-medium">Membutuhkan perhatian segera</p>
          </div>
        </div>

        {/* Alat Keluar Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Alat Keluar</p>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><ArrowDownRight className="w-4 h-4"/></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              {loading ? '...' : stats.alatKeluar.toLocaleString()}
            </h3>
            <p className="text-slate-400 text-[10px] mt-1 font-medium">24 jam terakhir</p>
          </div>
        </div>

        {/* Efisiensi Operasional Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Efisiensi Operasional</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500"><TrendingUp className="w-4 h-4"/></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-teal-600">
              {loading ? '...' : `${stats.efisiensi}%`}
            </h3>
            <p className="text-slate-400 text-[10px] mt-1 font-medium">Berdasarkan log harian</p>
          </div>
        </div>
      </div>
    </div>
  );
}
