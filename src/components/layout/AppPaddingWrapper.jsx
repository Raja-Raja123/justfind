"use client";

import { usePathname } from "next/navigation";

const ADMIN_DASHBOARD_PREFIX = "/admin";

export default function AppPaddingWrapper({ children }) {
  const pathname = usePathname();
  const isAdminDashboard = pathname?.startsWith(ADMIN_DASHBOARD_PREFIX);

  return <div className={isAdminDashboard ? undefined : "px-7.5"}>{children}</div>;
}
