'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { devLogin, devRegister } from '../actions';

const isDev = process.env.NEXT_PUBLIC_APP_ENV === 'development';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nama = formData.get('nama') as string;

    try {
      if (isDev) {
        if (isLogin) {
          await devLogin(email, password);
          setSuccessMsg('Berhasil masuk! Mengarahkan ke dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 800);
        } else {
          await devRegister(email, password, nama);
          setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
          setIsLogin(true);
        }
        return;
      }

      const isDemoMode = 
        !process.env.NEXT_PUBLIC_SUPABASE_URL || 
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'YOUR_SUPABASE_URL' ||
        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder-url.supabase.co';

      if (isDemoMode) {
        document.cookie = "demo_auth=true; path=/; max-age=86400";
        window.location.href = '/dashboard';
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Failed to fetch')) {
            throw new Error('Gagal terhubung ke Supabase. Periksa URL Anda.');
          }
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email atau password salah. Pastikan akun sudah didaftarkan.');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Email belum dikonfirmasi. Buka dashboard Supabase > Authentication > Providers > Email, lalu matikan "Confirm email".');
          }
          throw error;
        }
        
        setSuccessMsg('Berhasil masuk! Mengarahkan ke dashboard...');
        
        // Wait a tiny bit for cookies to be set by the auth state change listener, then do a full page reload
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nama: nama || email.split('@')[0],
              role: 'admin'
            }
          }
        });
        
        if (error) {
          if (error.message.includes('User already registered')) {
            throw new Error('Email sudah terdaftar. Silakan pilih opsi "Masuk". Jika Anda tidak bisa masuk karena email belum dikonfirmasi, periksa kotak masuk email Anda.');
          }
          throw error;
        }

        if (data.user) {
          const { error: insertError } = await supabase.from('users').upsert([{
            id: data.user.id,
            nama: nama || email.split('@')[0],
            email: email,
            role: 'admin'
          }], { onConflict: 'id' });

          if (insertError && !insertError.message.includes('row-level security') && !insertError.message.includes('recursion')) {
             console.error("Gagal menambahkan ke public.users", insertError);
          }
          
          setSuccessMsg('Pendaftaran berhasil! Silakan login (cek email untuk konfirmasi jika aktif).');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-sm w-full">
        <div className="flex justify-center mb-6">
           <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-sm">
             W
           </div>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight text-center mb-2">
          Puskesmas Wawo
        </h1>
        <p className="text-slate-500 mb-6 text-center text-sm">
          {isLogin ? 'Silakan masuk ke akun Anda' : 'Daftarkan akun baru'}
        </p>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-3 rounded-md text-sm mb-4 border border-rose-100">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-md text-sm mb-4 border border-emerald-100">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <input
                name="nama"
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
                placeholder="Nama Anda"
                required={!isLogin}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
              placeholder="admin@wawo.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 placeholder-slate-400"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white px-4 py-2.5 rounded-md font-medium text-sm transition-colors shadow-sm shadow-teal-200 disabled:opacity-70 mt-2"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMsg(null);
            }}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
          >
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}
