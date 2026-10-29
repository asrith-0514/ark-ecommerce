"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPlural, formatPieces } from "@/lib/formatters";

export default function AdminDashboardPage() {
  const { orders, products, currentUser, stockHealth, brandSalesData } = useAppStore();
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");

  // Dynamic calculations from database / state
  const pendingOrders = orders.filter((o) => o.status === "Submitted");
  const confirmedOrders = orders.filter(
    (o) => o.status === "Confirmed" || o.status === "Packing" || o.status === "Partially Dispatched"
  );
  const packingOrders = orders.filter((o) => o.status === "Packing");
  const dispatchedOrders = orders.filter(
    (o) => o.status === "Dispatched" || o.status === "Partially Dispatched"
  );

  const activeWholesaleValue = confirmedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Stock health calculated from actual variants
  const stockRatioPercent = Math.round(stockHealth.ratio * 100);

  // Brand sales with percentages summing to exactly 100%
  const totalBrandSalesValue = brandSalesData.reduce((sum, b) => sum + b.value, 0);
  const brandSalesWithPct = brandSalesData.map((b, index) => {
    const rawPct = (b.value / totalBrandSalesValue) * 100;
    return {
      ...b,
      pct: Math.round(rawPct),
    };
  });
  // Adjust sum to 100%
  const currentPctSum = brandSalesWithPct.reduce((sum, b) => sum + b.pct, 0);
  if (brandSalesWithPct.length > 0 && currentPctSum !== 100) {
    brandSalesWithPct[0].pct += 100 - currentPctSum;
  }

  // Greeting name
  const firstName = currentUser.name.split(" ")[0] || "Team";

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="dashboard" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 min-w-0">
          {/* Greeting Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_4px_20px_rgba(20,20,43,0.04)] border border-outline-variant/30">
            <div className="flex flex-col gap-1">
              <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
                Good morning, {firstName} 👋
              </h1>
              <p className="text-sm text-on-surface-variant flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>
                  <strong className="font-semibold text-on-surface">
                    {formatPlural(pendingOrders.length, "order", "orders")}
                  </strong>{" "}
                  need your review today
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                <span>Review Orders</span>
              </Link>
            </div>
          </div>

          {/* 4 KPI Cards - Dynamic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_4px_20px_rgba(20,20,43,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Orders Awaiting Review
                </span>
                <div className="w-10 h-10 rounded-xl bg-error-container/60 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">assignment_late</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                  {pendingOrders.length}
                </span>
                <span className="mt-2 text-xs text-on-surface-variant">
                  {pendingOrders.length === 1 ? "1 pending submission" : `${pendingOrders.length} pending submissions`}
                </span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_4px_20px_rgba(20,20,43,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Active Confirmed Volume
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">payments</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <span className="font-headline font-bold text-3xl text-primary tracking-tight">
                  {formatCurrency(activeWholesaleValue)}
                </span>
                <span className="mt-2 text-xs text-on-surface-variant">
                  Across {formatPlural(confirmedOrders.length, "confirmed order", "confirmed orders")}
                </span>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_4px_20px_rgba(20,20,43,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Packing In Progress
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">package_2</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                  {packingOrders.length}
                </span>
                <span className="mt-2 text-xs text-on-surface-variant">
                  {packingOrders.reduce((sum, o) => sum + o.approvedPieces, 0)} pcs in preparation
                </span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-[0_4px_20px_rgba(20,20,43,0.04)] border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Dispatched Orders
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
                  {dispatchedOrders.length}
                </span>
                <span className="mt-2 text-xs text-on-surface-variant">
                  {dispatchedOrders.reduce((sum, o) => sum + o.dispatchedPieces, 0)} pcs dispatched
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Stock Health Ring & Brand Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-w-0">
            {/* Stock Health Card */}
            <div className="bg-surface-container-lowest rounded-[20px] p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    Stock Health
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                    {formatPieces(stockHealth.totalPhysical)} physical
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mb-6">
                  Available stock vs physical inventory ratio (Available = Physical - Reserved).
                </p>

                {/* Ring Indicator */}
                <div className="flex items-center justify-center my-4">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#efecff"
                        strokeWidth="10"
                      />
                      {/* Progress circle: stroke-dasharray = 2 * pi * 40 ≈ 251.3 */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#413fd6"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="251.3"
                        strokeDashoffset={251.3 - (251.3 * stockRatioPercent) / 100}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-headline font-bold text-3xl text-on-surface">
                        {stockRatioPercent}%
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-surface-container text-center">
                <div>
                  <span className="block text-xs text-on-surface-variant">Physical</span>
                  <span className="font-bold text-sm text-on-surface">{stockHealth.totalPhysical}</span>
                </div>
                <div>
                  <span className="block text-xs text-on-surface-variant">Reserved</span>
                  <span className="font-bold text-sm text-amber-700">{stockHealth.totalReserved}</span>
                </div>
                <div>
                  <span className="block text-xs text-on-surface-variant">Available</span>
                  <span className="font-bold text-sm text-primary">{stockHealth.totalAvailable}</span>
                </div>
              </div>
            </div>

            {/* Brand Sales - All 8 Brands */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-[20px] p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    Brand Sales Split
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                    8 Brands • Total {formatCurrency(totalBrandSalesValue)}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mb-4">
                  Weekly wholesale sales contribution by apparel brand.
                </p>

                {/* 8 Brands Progress List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {brandSalesWithPct.map((b) => (
                    <div key={b.brand} className="flex flex-col gap-1.5 p-3 rounded-xl bg-surface-container-low/60 border border-surface-container">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-on-surface">{b.brand}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-on-surface-variant font-medium">
                            {formatCurrency(b.value)}
                          </span>
                          <span className="font-bold text-primary">{b.pct}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                <span>Sum of all 8 brand allocations: 100%</span>
                <Link href="/admin/reports" className="font-bold text-primary hover:underline">
                  View Full Sales Report →
                </Link>
              </div>
            </div>
          </div>

          {/* Section 4: Recent Orders Queue */}
          <div className="bg-surface-container-lowest rounded-[20px] p-6 border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Recent Wholesale Orders
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Ordered newest to oldest ({orders.length} total active orders)
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>View All Orders</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-container text-on-surface-variant uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Order No</th>
                    <th className="py-3 px-3">Retailer</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Requested</th>
                    <th className="py-3 px-3 text-right">Value</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {orders.slice(0, 5).map((order) => {
                    const statusBg =
                      order.status === "Submitted"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : order.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : order.status === "Packing"
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : order.status === "Partially Dispatched"
                        ? "bg-blue-100 text-blue-900 border-blue-200"
                        : order.status === "Dispatched"
                        ? "bg-purple-100 text-purple-900 border-purple-200"
                        : "bg-surface-container text-on-surface-variant border-outline-variant/30";

                    return (
                      <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-3 font-bold text-on-surface">
                          <Link href={`/admin/orders/${order.id}`} className="hover:text-primary">
                            {order.orderNo}
                          </Link>
                        </td>
                        <td className="py-3 px-3 text-on-surface">
                          <div className="font-semibold">{order.retailerName}</div>
                          <div className="text-on-surface-variant">{order.region}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-surface-container text-on-surface">
                            {order.category}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold border ${statusBg}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-on-surface">
                          {formatPieces(order.totalPieces)}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-on-surface">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

