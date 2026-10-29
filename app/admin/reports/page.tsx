"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { getPreviousCompletedWeekRange, formatCurrency, formatPieces } from "@/lib/formatters";

export default function AdminReportsPage() {
  const { brandSalesData } = useAppStore();
  const [selectedBrand, setSelectedBrand] = useState("All brands");

  // Calculated window: previous completed Monday 00:00 to Sunday 23:59:59.999 Asia/Kolkata
  // For 29 Oct 2026, this is: Mon 19 Oct to Sun 25 Oct 2026
  const reportWindow = getPreviousCompletedWeekRange();

  const filteredBrands = brandSalesData.filter((item) => {
    if (selectedBrand === "All brands") return true;
    return item.brand === selectedBrand;
  });

  const totalOrders = filteredBrands.reduce((acc, it) => acc + it.orders, 0);
  const totalPieces = filteredBrands.reduce((acc, it) => acc + it.pieces, 0);
  const totalValue = filteredBrands.reduce((acc, it) => acc + it.value, 0);
  const totalPending = filteredBrands.reduce((acc, it) => acc + it.pendingPieces, 0);

  const handleExportCSV = () => {
    const headers = [
      "Brand",
      "Orders (count)",
      "Dispatched (pcs)",
      "Sales Value (Rs)",
      "Pending (pcs)",
      "Vs Last Week",
    ];
    const rows = filteredBrands.map((b) => [
      b.brand,
      b.orders,
      b.pieces,
      b.value,
      b.pendingPieces,
      b.vsLastWeek,
    ]);

    // Total row has empty 'Vs last week'
    rows.push(["Total", totalOrders, totalPieces, totalValue, totalPending, ""]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ARK_Connect_Weekly_Sales_Report_${reportWindow.formattedRange.replace(/[\s–]/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="reports" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 pb-20 min-w-0">
          {/* 1. Header with calculated window & actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
                Weekly Sales Report
              </h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                {reportWindow.label} (Asia/Kolkata)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface text-xs font-semibold shadow-sm transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">download</span>
                <span>Export CSV</span>
              </button>

              <Link
                href="/admin/reports/print"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Report</span>
              </Link>
            </div>
          </div>

          {/* 2. Four Operational Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Orders
              </span>
              <div className="mt-3">
                <span className="text-3xl font-black text-on-surface">{totalOrders}</span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Across all active brands
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Volume
              </span>
              <div className="mt-3">
                <span className="text-3xl font-black text-on-surface">{totalPieces}</span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Pieces dispatched in window
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Total Sales Value
              </span>
              <div className="mt-3">
                <span className="text-3xl font-black text-primary">
                  {formatCurrency(totalValue)}
                </span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Gross wholesale sales
                </span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Pending Volume
              </span>
              <div className="mt-3">
                <span className="text-3xl font-black text-amber-700">{totalPending}</span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Confirmed pieces to dispatch
                </span>
              </div>
            </div>
          </div>

          {/* 3. Filter Bar */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-4 min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-on-surface-variant">Filter Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-1.5 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                <option value="All brands">All brands (8 brands)</option>
                {brandSalesData.map((b) => (
                  <option key={b.brand} value={b.brand}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-on-surface-variant">
              Window: {reportWindow.label}
            </span>
          </div>

          {/* 4. Sales Report Table - Plain numbers in cells, units in headers */}
          <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-container">
                    <th className="py-3 px-4 rounded-l-xl min-w-[150px]">Brand</th>
                    <th className="py-3 px-4 text-right">Orders (count)</th>
                    <th className="py-3 px-4 text-right">Dispatched (pcs)</th>
                    <th className="py-3 px-4 text-right">Value (Rs)</th>
                    <th className="py-3 px-4 text-right">Pending (pcs)</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Vs Last Week</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60 font-medium">
                  {filteredBrands.map((row) => (
                    <tr key={row.brand} className="hover:bg-surface-container-low/40 transition-colors">
                      {/* Brand column wide enough for "Belly Belly" */}
                      <td className="py-3.5 px-4 font-bold text-on-surface min-w-[150px]">
                        {row.brand}
                      </td>
                      {/* Plain numbers */}
                      <td className="py-3.5 px-4 text-right text-on-surface">
                        {row.orders}
                      </td>
                      <td className="py-3.5 px-4 text-right text-on-surface">
                        {row.pieces}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                        {row.value}
                      </td>
                      <td className="py-3.5 px-4 text-right text-amber-700">
                        {row.pendingPieces}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-semibold ${
                            row.vsLastWeek.startsWith("+")
                              ? "text-emerald-700"
                              : "text-error"
                          }`}
                        >
                          {row.vsLastWeek}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Row with empty 'Vs last week' */}
                <tfoot>
                  <tr className="bg-surface-container-low border-t-2 border-surface-container font-extrabold text-on-surface">
                    <td className="py-3.5 px-4 rounded-l-xl min-w-[150px]">Total</td>
                    <td className="py-3.5 px-4 text-right">{totalOrders}</td>
                    <td className="py-3.5 px-4 text-right">{totalPieces}</td>
                    <td className="py-3.5 px-4 text-right text-primary">{totalValue}</td>
                    <td className="py-3.5 px-4 text-right text-amber-800">{totalPending}</td>
                    {/* Empty "Vs last week" cell in Total row */}
                    <td className="py-3.5 px-4 text-center rounded-r-xl"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

