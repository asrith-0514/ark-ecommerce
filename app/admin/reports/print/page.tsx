"use client";

import React from "react";
import Link from "next/link";
import { BRAND_SALES_REPORT } from "@/lib/data";
import { getPreviousCompletedWeekRange, formatCurrency } from "@/lib/formatters";

export default function AdminReportsPrintPage() {
  const reportWindow = getPreviousCompletedWeekRange();

  const totalOrders = BRAND_SALES_REPORT.reduce((acc, it) => acc + it.orders, 0);
  const totalPieces = BRAND_SALES_REPORT.reduce((acc, it) => acc + it.pieces, 0);
  const totalValue = BRAND_SALES_REPORT.reduce((acc, it) => acc + it.value, 0);
  const totalPending = BRAND_SALES_REPORT.reduce((acc, it) => acc + it.pendingPieces, 0);

  return (
    <div className="bg-[#F7F6F3] text-on-surface min-h-screen py-8 px-4 print:bg-white print:p-0">
      {/* On-screen control bar (hidden in print) */}
      <div className="max-w-[800px] mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/reports"
          className="flex items-center gap-2 text-on-surface hover:text-primary font-semibold text-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Reports</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-xs shadow-md hover:opacity-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Print Weekly Report</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-sm p-8 print:p-0 print:shadow-none print:w-full">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
              <span className="font-bold text-xl tracking-tight font-headline">ARK Connect</span>
            </div>
            <h1 className="text-2xl font-bold mt-2 text-on-surface font-headline">
              Weekly Sales Report
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              {reportWindow.label} (Asia/Kolkata)
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full bg-surface-container text-xs font-semibold">
              Official Record
            </span>
          </div>
        </div>

        {/* 4 KPI Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant font-medium block">Total Orders</span>
            <span className="text-xl font-bold text-on-surface block mt-1">
              {totalOrders}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant font-medium block">Volume (pcs)</span>
            <span className="text-xl font-bold text-on-surface block mt-1">
              {totalPieces}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant font-medium block">Value (Rs)</span>
            <span className="text-xl font-bold text-on-surface block mt-1">
              {formatCurrency(totalValue)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant font-medium block">Pending (pcs)</span>
            <span className="text-xl font-bold text-on-surface block mt-1">
              {totalPending}
            </span>
          </div>
        </div>

        {/* Brand Breakdown Table - Plain numbers in cells, units in headers */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-3 font-headline">Sales by Brand</h2>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-surface-container-low text-xs text-on-surface-variant font-semibold">
                <th className="py-2.5 px-3 min-w-[140px]">Brand</th>
                <th className="py-2.5 px-3 text-right">Orders (count)</th>
                <th className="py-2.5 px-3 text-right">Dispatched (pcs)</th>
                <th className="py-2.5 px-3 text-right">Value (Rs)</th>
                <th className="py-2.5 px-3 text-right">Pending (pcs)</th>
                <th className="py-2.5 px-3 text-center">Vs Last Week</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/60">
              {BRAND_SALES_REPORT.map((row) => (
                <tr key={row.brand} className="hover:bg-surface-container-low/30">
                  <td className="py-2.5 px-3 font-bold text-on-surface min-w-[140px]">
                    {row.brand}
                  </td>
                  <td className="py-2.5 px-3 text-right">{row.orders}</td>
                  <td className="py-2.5 px-3 text-right">{row.pieces}</td>
                  <td className="py-2.5 px-3 text-right font-bold">{row.value}</td>
                  <td className="py-2.5 px-3 text-right">{row.pendingPieces}</td>
                  <td className="py-2.5 px-3 text-center font-semibold">
                    {row.vsLastWeek}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Row with empty 'Vs last week' */}
            <tfoot>
              <tr className="border-t-2 font-extrabold bg-surface-container-low">
                <td className="py-2.5 px-3 min-w-[140px]">Total</td>
                <td className="py-2.5 px-3 text-right">{totalOrders}</td>
                <td className="py-2.5 px-3 text-right">{totalPieces}</td>
                <td className="py-2.5 px-3 text-right">{totalValue}</td>
                <td className="py-2.5 px-3 text-right">{totalPending}</td>
                <td className="py-2.5 px-3 text-center"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <footer className="pt-4 border-t text-xs text-outline flex items-center justify-between">
          <span>ARK Connect Weekly Reporting</span>
          <span>Window: {reportWindow.label}</span>
        </footer>
      </div>
    </div>
  );
}

