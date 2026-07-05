"use client";

import { useState, useEffect } from "react";
import { Printer, Calendar } from "lucide-react";
import { getAlatMedis, AlatMedis } from "../../services/alatMedisService";

export default function LaporanPage() {
  const [items, setItems] = useState<AlatMedis[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAlatMedis();
        setItems(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredItems = items.filter((item) => {
    if (!startDate && !endDate) return true;
    
    const itemDate = new Date(item.updated_at || item.created_at || new Date());
    itemDate.setHours(0, 0, 0, 0);

    const start = startDate ? new Date(startDate) : new Date("1970-01-01");
    start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : new Date("2100-01-01");
    end.setHours(23, 59, 59, 999);

    return itemDate >= start && itemDate <= end;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
            Laporan & Rekapitulasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Unduh atau cetak rekap data inventaris.
          </p>
        </div>
      </div>

      {/* Filter Section (Hidden on Print) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dari Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sampai Tanggal</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Report Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between print:border-b-2 print:border-slate-800">
          <div className="flex items-center gap-4">
             <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md font-medium text-xs shadow-sm transition-colors inline-flex items-center justify-center print:hidden"
              >
                <Printer className="w-4 h-4 mr-2" />
                Cetak Laporan
             </button>
             <h3 className="font-bold text-slate-800 hidden print:block text-xl">Laporan Rekapitulasi Alat Medis</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 print:bg-white print:border-b-2 print:border-slate-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 print:border-slate-800 print:text-black"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 print:border-slate-800 print:text-black"
                >
                  Nama Alat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 print:border-slate-800 print:text-black"
                >
                  Jenis Alat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center print:border-slate-800 print:text-black"
                >
                  Jumlah
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 print:border-slate-800 print:text-black"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 print:border-slate-800 print:text-black"
                >
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 print:divide-slate-300">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Tidak ada data ditemukan pada rentang tanggal tersebut.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors print:hover:bg-transparent"
                  >
                    <td className="px-6 py-3 text-slate-600 text-sm whitespace-nowrap print:text-black">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap print:text-black">
                      {item.nama_alat}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-sm whitespace-nowrap print:text-black">
                      {item.jenis_alat}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-slate-900 whitespace-nowrap print:text-black">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap print:text-black">
                      <span
                        className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase print:text-black print:border print:border-slate-300 print:bg-transparent
                        ${
                          item.status === "Baik"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "Rusak"
                              ? "bg-rose-50 text-rose-700"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-sm whitespace-nowrap print:text-black">
                      {item.updated_at ? new Date(item.updated_at).toLocaleDateString('id-ID') : new Date(item.created_at || '').toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
