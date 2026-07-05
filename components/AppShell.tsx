"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import InstallPWA from "./InstallPWA";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isPublicPage = pathname === "/" || pathname === "/login";

  if (isPublicPage) {
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
