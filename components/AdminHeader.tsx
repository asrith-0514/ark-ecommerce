"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store-context";
import { getCurrentWeekRange } from "@/lib/formatters";

export function AdminHeader() {
  const { orders } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const pendingOrders = orders.filter((o) => o.status === "Submitted").length;

  // Date chip is dynamically calculated from today's date (week Monday to Sunday)
  const currentWeek = getCurrentWeekRange();

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/30 z-40 px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(20,20,43,0.03)]">
      {/* Search Input Bar */}
      <div className="flex items-center flex-1 max-w-lg">
        <div className="w-full flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-[18px] text-outline mr-2">search</span>
          <input
            type="text"
            placeholder="Search orders, retailers, SKUs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs text-on-surface placeholder:text-outline font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-outline hover:text-on-surface ml-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Utilities */}
      <div className="flex items-center gap-3">
        {/* Calculated Date Chip */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
          <span>{currentWeek.label}</span>
        </div>

        {/* Notifications Bell */}
        <Link
          href="/admin/orders"
          className="relative p-2 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          aria-label="Pending review notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {pendingOrders > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse" />
          )}
        </Link>
      </div>
    </header>
  );
}

export default AdminHeader;
