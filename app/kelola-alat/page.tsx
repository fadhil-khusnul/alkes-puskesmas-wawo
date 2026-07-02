"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, AlertCircle, X } from "lucide-react";
import {
  getAlatMedis,
  createAlatMedis,
  updateAlatMedis,
  deleteAlatMedis,
  AlatMedis,
} from "../../services/alatMedisService";

export default function KelolaAlatPage() {
  const [items, setItems] = useState<AlatMedis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlatMedis | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_alat: "",
    jenis_alat: "",
    jumlah: 0,
    status: "Baik" as AlatMedis["status"],
    catatan: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleOpenModal = (item?: AlatMedis) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nama_alat: item.nama_alat,
        jenis_alat: item.jenis_alat,
        jumlah: item.jumlah,
        status: item.status,
        catatan: item.catatan || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        nama_alat: "",
        jenis_alat: "",
        jumlah: 0,
        status: "Baik",
        catatan: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateAlatMedis(editingItem.id, formData);
      } else {
        await createAlatMedis(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Gagal menyimpan data.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await deleteAlatMedis(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.nama_alat.toLowerCase().includes(search.toLowerCase()) ||
      item.jenis_alat.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
            Kelola Alat Medis
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen inventaris peralatan dan barang habis pakai.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium text-xs shadow-sm shadow-teal-200 transition-colors w-full sm:w-auto inline-flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Tambah Alat
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
        <div className="flex gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau jenis alat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-teal-500 outline-none text-slate-700 placeholder-slate-400"
            />
          </div>
          <button className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
            Filter
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">
            Inventaris Alat Medis Padat
          </h3>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  Nama Alat
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  Jenis
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center"
                >
                  Jumlah
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {item.nama_alat}
                      {item.catatan && (
                        <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                          {item.catatan}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-sm whitespace-nowrap">
                      {item.jenis_alat}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-slate-900 whitespace-nowrap">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase
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
                    <td className="px-6 py-3 text-right text-sm whitespace-nowrap">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-teal-600 hover:text-teal-900 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-rose-600 hover:text-rose-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8 text-sm text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            Memuat data...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            Tidak ada data ditemukan.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.nama_alat}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {item.jenis_alat}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase
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
              </div>
              <div className="flex justify-between items-end mt-4">
                <div className="text-sm font-bold text-slate-900">
                  Jumlah: {item.jumlah}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="text-teal-600 hover:text-teal-900 mr-3"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-rose-600 hover:text-rose-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">
                {editingItem ? "Edit Alat Medis" : "Tambah Alat Medis"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Nama Alat
                </label>
                <input
                  required
                  type="text"
                  value={formData.nama_alat}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_alat: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Jenis Alat
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.jenis_alat}
                    onChange={(e) =>
                      setFormData({ ...formData, jenis_alat: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Jumlah
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={formData.jumlah}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        jumlah: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Status Kondisi
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 bg-white"
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak">Rusak</option>
                  <option value="Habis">Habis</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={3}
                  value={formData.catatan}
                  onChange={(e) =>
                    setFormData({ ...formData, catatan: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-md text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 focus:outline-none transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium text-xs shadow-sm shadow-teal-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
