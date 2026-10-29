"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { OrderStatus } from "@/lib/data";
import { formatCurrency, formatItems, formatPieces } from "@/lib/formatters";

const REAL_STATUSES: OrderStatus[] = [
  "Submitted",
  "Confirmed",
  "Packing",
  "Partially Dispatched",
  "Dispatched",
  "Delivered",
  "Rejected",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const { orders } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (
      search &&
      !o.orderNo.toLowerCase().includes(search.toLowerCase()) &&
      !o.retailerName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="orders" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 min-w-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
                Wholesale Orders
              </h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Review submitted orders, amend quantities, and release for packing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/orders/ORD-8830"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                <span>Review Order (ORD-8830)</span>
              </Link>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus("all")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filterStatus === "all"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
              >
                <span>All Orders</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                    filterStatus === "all"
                      ? "bg-white/20 text-white"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  {orders.length}
                </span>
              </button>

              {REAL_STATUSES.map((status) => {
                const count = orders.filter((o) => o.status === status).length;
                if (count === 0 && filterStatus !== status) return null;
                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      filterStatus === status
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span>{status}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                        filterStatus === status
                          ? "bg-white/20 text-white"
                          : "bg-surface-container text-on-surface"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low rounded-full w-72 border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-outline">search</span>
              <input
                type="text"
                placeholder="Search order or retailer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-xs text-on-surface placeholder:text-outline outline-none w-full font-medium"
              />
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">Order No</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Retailer</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Items</th>
                    <th className="py-3 px-4 text-right">Pieces</th>
                    <th className="py-3 px-4 text-right">Value</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60">
                  {filteredOrders.map((order) => {
                    const statusClass =
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
                        : order.status === "Delivered"
                        ? "bg-teal-100 text-teal-900 border-teal-200"
                        : "bg-surface-container text-on-surface-variant border-outline-variant/30";

                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-surface-container-low/60 transition-colors"
                      >
                        <td className="py-4 px-4 font-bold text-on-surface">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{order.orderNo}</span>
                          </Link>
                        </td>
                        <td className="py-4 px-4 text-on-surface-variant whitespace-nowrap">
                          {order.createdAt}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-on-surface">{order.retailerName}</div>
                          <div className="text-on-surface-variant text-xs">{order.region}</div>
                        </td>
                        {/* Retailer Category Column */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-surface-container text-on-surface">
                            {order.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold border ${statusClass}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-on-surface font-medium">
                          {formatItems(order.items.length)}
                        </td>
                        <td className="py-4 px-4 text-right text-on-surface font-medium">
                          {order.status === "Submitted"
                            ? formatPieces(order.totalPieces)
                            : formatPieces(order.approvedPieces)}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-on-surface">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-4 px-4 text-center">
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
