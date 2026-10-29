"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store-context";
import Link from "next/link";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isRetailerRoute =
    pathname.startsWith("/shop") ||
    pathname.startsWith("/cart") ||
    (pathname.startsWith("/orders") && !pathname.startsWith("/admin/orders"));

  // Check role violations
  if (currentUser.role === "retailer" && isAdminRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-error-container/30 text-error flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            Access Restricted
          </h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Retailer accounts cannot access staff operations. Please proceed to the retailer store.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/shop"
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-95 transition-opacity"
            >
              Go to Store
            </Link>
            <button
              onClick={() => {
                switchRole("staff");
                router.push("/admin/dashboard");
              }}
              className="w-full py-2.5 bg-surface-container text-on-surface rounded-xl font-medium text-xs hover:bg-surface-container-high transition-colors"
            >
              Switch to Staff Account (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === "staff" && isRetailerRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[28px]">admin_panel_settings</span>
          </div>
          <h2 className="font-headline font-bold text-xl text-on-surface mb-2">
            Staff Account Active
          </h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Staff members cannot open retailer shopping pages directly. Please use the staff administration console.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/dashboard"
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:opacity-95 transition-opacity"
            >
              Return to Staff Dashboard
            </Link>
            <button
              onClick={() => {
                switchRole("retailer");
                router.push("/shop");
              }}
              className="w-full py-2.5 bg-surface-container text-on-surface rounded-xl font-medium text-xs hover:bg-surface-container-high transition-colors"
            >
              Switch to Retailer Account (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

