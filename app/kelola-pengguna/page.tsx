"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from "../../services/userService";

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "staf" as User["role"],
  });

  const fetchData = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
        const { devGetUser } = await import("../../app/actions");
        const { data: { user } } = await devGetUser();
        if (user) {
          setCurrentUserRole(user.role || 'staf');
        } else {
          setCurrentUserRole('admin'); // Fallback
        }
      } else {
        const { supabase } = await import("../../lib/supabaseClient");
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data: userRecord } = await supabase.from('users').select('role').eq('id', user.id).single();
           setCurrentUserRole(userRecord?.role || 'staf');
        } else {
           setCurrentUserRole('admin'); // Fallback for demo
        }
      }
      await fetchData();
      setLoading(false);
    };
    load();
  }, []);

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nama: user.nama,
        email: user.email,
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({ nama: "", email: "", role: "staf" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error("Error saving data:", error);
      alert(
        `Gagal menyimpan data pengguna: ${error?.message || "Terjadi kesalahan"}`,
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
      try {
        await deleteUser(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
            Kelola Pengguna
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen akun staf dan administrator sistem.
          </p>
        </div>
        {currentUserRole === 'admin' && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md font-medium text-xs shadow-sm shadow-teal-200 transition-colors w-full sm:w-auto inline-flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Pengguna
          </button>
        )}
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
              placeholder="Cari nama atau email..."
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
          <h3 className="font-bold text-slate-800">Daftar Pengguna Sistem</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  No
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  Nama Pengguna
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100"
                >
                  Peran
                </th>
                {currentUserRole === 'admin' && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right"
                  >
                    Aksi
                  </th>
                )}
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-slate-600 text-sm whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {user.nama}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-sm whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase
                        ${user.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    {currentUserRole === 'admin' && (
                      <td className="px-6 py-3 text-right text-sm whitespace-nowrap">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-teal-600 hover:text-teal-900 mr-3"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-rose-600 hover:text-rose-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
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
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            Tidak ada pengguna ditemukan.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {user.nama}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {user.email}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase
                        ${user.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}
                >
                  {user.role}
                </span>
              </div>
              {currentUserRole === 'admin' && (
                <div className="flex justify-end items-end mt-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-teal-600 hover:text-teal-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-rose-600 hover:text-rose-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
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
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
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
                  Nama Lengkap
                </label>
                <input
                  required
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Peran
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 bg-white"
                >
                  <option value="staf">Staf Medis</option>
                  <option value="admin">Administrator</option>
                </select>
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
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
