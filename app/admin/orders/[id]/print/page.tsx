"use client";

import React, { use, Suspense } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPieces } from "@/lib/formatters";

function OrderPrintContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { orders } = useAppStore();

  const order = orders.find((o) => o.id === resolvedParams.id) || orders[0];

  const totalPieces =
    order.items.length > 0
      ? order.items.reduce((acc, it) => acc + (it.approvedQty || it.orderedQty), 0)
      : order.approvedPieces || order.totalPieces;

  const totalAmount =
    order.items.length > 0
      ? order.items.reduce((acc, it) => acc + (it.approvedQty || it.orderedQty) * it.unitPrice, 0)
      : order.totalAmount;

  return (
    <div className="bg-[#F7F6F3] text-on-surface min-h-screen py-8 px-4 print:bg-white print:p-0">
      {/* On-screen control bar (hidden when printed) */}
      <div className="max-w-[760px] mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/admin/orders/${order.id}`}
          className="flex items-center gap-2 text-on-surface hover:text-primary font-semibold text-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Order Review</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold text-xs shadow-md hover:opacity-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Print Packing Slip</span>
        </button>
      </div>

      {/* Sheet Container */}
      <div className="w-full max-w-[760px] mx-auto bg-surface-container-lowest rounded-2xl shadow-sm p-10 flex flex-col gap-8 text-[#14142B] print:p-0 print:shadow-none print:w-full">
        {/* Document Header */}
        <header className="flex flex-col gap-4 border-b border-surface-container pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold text-[#14142B] tracking-tight font-headline">
                Order {order.orderNo}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "Confirmed"
                    ? "bg-[#D1FAE5] text-[#065F46]"
                    : order.status === "Dispatched"
                    ? "bg-[#E0E7FF] text-[#3730A3]"
                    : "bg-[#FEF3C7] text-[#92400E]"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#14142B] block">{order.createdAt}</span>
              <span className="font-mono text-xs text-outline">ARK Connect</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#14142B]">{order.retailerName}</span>
              <span className="text-xs text-on-surface-variant">
                {order.region} · Category: <strong className="text-primary">{order.category}</strong>
              </span>
            </div>

            {order.lrNumber && (
              <div className="text-right bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
                <span className="text-xs text-outline uppercase block">Transporter & LR</span>
                <span className="font-semibold text-xs text-primary">
                  {order.transporterName} • LR #{order.lrNumber}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Items Table Area */}
        <section className="flex flex-col w-full">
          <div className="grid grid-cols-12 gap-2 pb-3 bg-surface-container-low px-3 py-2.5 rounded-lg text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            <div className="col-span-5">Item</div>
            <div className="col-span-3">SKU</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          <div className="divide-y divide-surface-container/60">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 py-3.5 px-3 text-xs items-center"
              >
                <div className="col-span-5 font-semibold text-on-surface">
                  <div>{item.productTitle}</div>
                  <div className="text-on-surface-variant text-xs">{item.brand}</div>
                </div>
                <div className="col-span-3 font-mono text-on-surface-variant">
                  {item.sku}
                </div>
                <div className="col-span-2 text-right font-bold text-on-surface">
                  {formatPieces(item.approvedQty || item.orderedQty)}
                </div>
                <div className="col-span-2 text-right font-bold text-on-surface">
                  {formatCurrency((item.approvedQty || item.orderedQty) * item.unitPrice)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-surface-container flex items-center justify-between">
            <span className="font-bold text-sm text-on-surface">Total Order Quantity</span>
            <span className="font-extrabold text-base text-primary">
              {formatPieces(totalPieces)}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="font-bold text-sm text-on-surface">Total Amount</span>
            <span className="font-extrabold text-lg text-on-surface">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </section>

        {/* Footer verification notes */}
        <footer className="pt-6 border-t border-surface-container flex items-center justify-between text-xs text-outline">
          <span>Prepared by Operations</span>
          <span>ARK Connect Dispatch Documentation</span>
        </footer>
      </div>
    </div>
  );
}

export default function AdminOrderPrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-primary font-bold text-sm">Preparing Slip...</div>
        </div>
      }
    >
      <OrderPrintContent params={params} />
    </Suspense>
  );
}

