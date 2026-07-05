"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import InstallPWA from "./InstallPWA";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return (
      <>
        {children}
        <InstallPWA />
      </>
    );
  }

  return (
    <>
      <Sidebar>{children}</Sidebar>
      <InstallPWA />
    </>
  );
}
