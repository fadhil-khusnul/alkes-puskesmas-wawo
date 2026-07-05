"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  User,
  Info,
  LogOut,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { devGetUser, devLogout } from "../app/actions";

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Kelola Pengguna", href: "/kelola-pengguna", icon: Users },
  { name: "Kelola Alat Medis", href: "/kelola-alat", icon: Stethoscope },
  { name: "Laporan", href: "/laporan", icon: FileText },
  { name: "Profil", href: "/profil", icon: User },
  { name: "Tentang Kami", href: "/tentang", icon: Info },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "Admin System", role: "Administrator" });
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      if (isDev) {
        const { data: { user } } = await devGetUser();
        if (user) {
          setUserData({
            name: user.nama || user.email.split('@')[0],
            role: user.role === "admin" ? "Administrator" : "Staf",
          });
        }
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userRecord } = await supabase.from('users').select('nama, role').eq('id', user.id).single();
        setUserData({
          name: userRecord?.nama || user.email?.split('@')[0] || "User",
          role: userRecord?.role === "admin" ? "Administrator" : "Staf"
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (isDev) {
      await devLogout();
      window.location.href = "/login";
      return;
    }

    const isDemoMode =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-url.supabase.co";

    if (isDemoMode) {
      document.cookie = "demo_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } else {
      await supabase.auth.signOut();
    }
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden text-sm">
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white">
            W
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight uppercase tracking-wider text-white truncate">
              Puskesmas Wawo
            </h1>
            <p className="text-[10px] text-slate-400">Med-Manage System v1.0</p>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              // Highlight active link for visual feedback matching the theme
              const isActive = pathname === item.href;
              return (
                <li key={item.name} className="px-4">
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="p-6 border-t border-slate-800 mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:bg-slate-800 hover:text-rose-300 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
              {navItems.find((item) => item.href === pathname)?.name ||
                "Dashboard"}
            </h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium uppercase tracking-wider">
              {new Date().toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="flex items-center gap-3 focus:outline-none hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              >
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700 leading-tight">
                    {userData.name}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase">{userData.role}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs uppercase">
                  {userData.name.charAt(0)}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden">
                  <div className="py-1">
                    <Link
                      href="/profil"
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profil Saya
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white mr-3">
              W
            </div>
            <span className="font-bold text-slate-900 uppercase tracking-wider text-sm">
              Puskesmas Wawo
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
