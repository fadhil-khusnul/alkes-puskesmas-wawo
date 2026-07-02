import type { Metadata } from "next";
import "./globals.css"; // Global styles
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "Puskesmas Wawo - SIM Alat Medis",
  description: "Sistem Informasi Manajemen Alat Medis Puskesmas Wawo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
