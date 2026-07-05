"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { devGetUser, devUpdateUser } from "../../app/actions";

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

export default function ProfilPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    username: "",
    peran: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (isDev) {
          const { data: { user } } = await devGetUser();
          if (user) {
            setFormData((prev) => ({
              ...prev,
              username: user.nama || user.email.split("@")[0] || "",
              peran: user.role || "Staf",
            }));
          }
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: userRecord } = await supabase
            .from("users")
            .select("nama, role")
            .eq("id", user.id)
            .single();

          setFormData((prev) => ({
            ...prev,
            username: userRecord?.nama || user.email?.split("@")[0] || "",
            peran: userRecord?.role || "Staf",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok." });
      setUpdating(false);
      return;
    }

    try {
      // In a real application, you might verify the current password first.
      // For Supabase, to update the password we just call updateUser.
      const updates: any = {};

      if (formData.newPassword) {
        updates.password = formData.newPassword;
      }

      if (isDev) {
        const { data: { user } } = await devGetUser();
        if (user) {
          if (formData.username) {
            updates.nama = formData.username;
          }
          if (Object.keys(updates).length > 0) {
            await devUpdateUser(user.id, updates);
          }
        }
      } else {
        // We might also want to update the user's name in our public.users table
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (formData.username) {
            const { error: dbError } = await supabase
              .from("users")
              .update({ nama: formData.username })
              .eq("id", user.id);

            if (dbError) throw dbError;
          }

          if (Object.keys(updates).length > 0) {
            const { error: authError } = await supabase.auth.updateUser(updates);
            if (authError) throw authError;
          }
        }
      }

      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.message || "Gagal memperbarui profil." });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
          Profil Pengguna
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola informasi akun dan kata sandi Anda.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              { loading ? "Memuat..." : formData.username }
            </h2>
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mt-1">
              { loading ? "..." : formData.peran }
            </p>
          </div>
        </div>

        <div className="p-6">
          { message.text && (
            <div className={ `p-4 rounded-md text-sm mb-6 ${message.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}` }>
              { message.text }
            </div>
          ) }

          <form onSubmit={ handleSubmit } className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Username / Nama
              </label>
              <input
                type="text"
                value={ formData.username }
                onChange={ (e) => setFormData({ ...formData, username: e.target.value }) }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                placeholder="Nama Anda"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Peran
              </label>
              <input
                type="text"
                value={ formData.peran }
                disabled
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500 cursor-not-allowed uppercase"
              />
              <p className="text-[10px] text-slate-400 mt-1">Peran tidak dapat diubah sendiri.</p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Ubah Kata Sandi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    value={ formData.currentPassword }
                    onChange={ (e) => setFormData({ ...formData, currentPassword: e.target.value }) }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    placeholder="Masukkan sandi saat ini"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={ formData.newPassword }
                    onChange={ (e) => setFormData({ ...formData, newPassword: e.target.value }) }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    placeholder="Sandi baru (opsional)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={ formData.confirmPassword }
                    onChange={ (e) => setFormData({ ...formData, confirmPassword: e.target.value }) }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
                    placeholder="Ulangi sandi baru"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={ updating }
                className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                { updating ? "Menyimpan..." : "Update Profil" }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
