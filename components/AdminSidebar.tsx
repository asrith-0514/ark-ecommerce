"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store-context";

export function AdminSidebar({ activePath }: { activePath?: string }) {
  const pathname = usePathname();
  const { orders, currentUser } = useAppStore();

  const pendingOrdersCount = orders.filter((o) => o.status === "Submitted").length;
  const dispatchQueueCount = orders.filter(
    (o) => o.status === "Confirmed" || o.status === "Packing" || o.status === "Partially Dispatched"
  ).length;

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard", exact: true },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: "receipt_long",
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
    },
    { label: "Inventory", href: "/admin/inventory", icon: "inventory_2" },
    {
      label: "Dispatch",
      href: "/admin/dispatch",
      icon: "local_shipping",
      badge: dispatchQueueCount > 0 ? `${dispatchQueueCount}` : undefined,
    },
    { label: "Pricing", href: "/admin/pricing", icon: "payments" },
    { label: "Reports", href: "/admin/reports", icon: "bar_chart" },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (activePath) {
      if (activePath === "dashboard" && href === "/admin/dashboard") return true;
      if (href === `/admin/${activePath}`) return true;
    }
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Initials for avatar
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container-lowest/95 backdrop-blur-xl border-r border-outline-variant/30 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(20,20,43,0.04)]">
      <div className="flex flex-col">
        {/* Brand Header: ONLY 'ARK Connect' */}
        <div className="h-16 px-5 flex items-center border-b border-surface-container/60">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary font-bold shadow-[0_2px_8px_rgba(65,63,214,0.3)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <span className="font-headline font-bold text-lg text-on-surface tracking-tight">
              ARK Connect
            </span>
          </Link>
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-wider">
            Operations Menu
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-primary-container to-secondary text-on-primary shadow-[0_4px_14px_rgba(91,91,240,0.25)]"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      active ? "text-on-primary" : "text-primary"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-error-container text-on-error-container animate-pulse"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card - Reads from logged in user */}
      <div className="p-3 m-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between shadow-[0_1px_4px_rgba(20,20,43,0.04)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-xs font-bold shadow-sm">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-container-lowest" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate">
              {currentUser.name}
            </span>
            <span className="text-xs text-on-surface-variant truncate">
              {currentUser.title}
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
