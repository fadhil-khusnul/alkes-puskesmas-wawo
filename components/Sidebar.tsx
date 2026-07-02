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
import { useState } from "react";

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
  const pathname = usePathname();

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
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-2.5 text-rose-400 hover:bg-slate-800 hover:text-rose-300 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
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
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
