"use client";

import React, { use, Suspense } from "react";
import Link from "next/link";
import StoreNav from "@/components/StoreNav";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPieces, formatItems } from "@/lib/formatters";

function RetailerOrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { orders, addToCart, showToast } = useAppStore();

  const order = orders.find((o) => o.id === resolvedParams.id) || orders[0];

  const totalPieces =
    order.items.length > 0
      ? order.items.reduce((acc, it) => acc + (it.approvedQty || it.orderedQty), 0)
      : order.approvedPieces || order.totalPieces;

  const totalAmount =
    order.items.length > 0
      ? order.items.reduce((acc, it) => acc + (it.approvedQty || it.orderedQty) * it.unitPrice, 0)
      : order.totalAmount;

  const handleReorder = () => {
    order.items.forEach((it) => {
      addToCart({
        productId: it.productId,
        variantId: `V-${it.sku}`,
        productTitle: it.productTitle,
        brand: it.brand,
        sku: it.sku,
        size: it.size,
        color: it.color,
        colorHex: it.colorHex,
        qty: it.orderedQty,
        unitPrice: it.unitPrice,
      });
    });
    showToast(`Items from ${order.orderNo} added to your cart.`);
  };

  return (
    <div className="bg-[#fcf8ff] min-h-screen text-on-surface antialiased flex flex-col pb-28">
      <StoreNav />

      <main className="flex-1 flex flex-col relative w-full pt-20 max-w-2xl mx-auto px-4 md:px-6 gap-4">
        {/* Back link & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="flex items-center gap-1.5 text-xs text-on-surface hover:text-primary font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Orders</span>
          </Link>
          <button
            onClick={handleReorder}
            className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold hover:opacity-95"
          >
            Reorder All Items
          </button>
        </div>

        {/* Hero Order Card */}
        <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-outline uppercase tracking-wider">
                Wholesale Order
              </span>
              <h1 className="font-headline text-2xl font-bold text-on-surface mt-0.5">
                {order.orderNo}
              </h1>
              <p className="text-xs text-outline mt-0.5">{order.createdAt}</p>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {order.status}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-container-low text-xs">
            <div>
              <span className="text-on-surface-variant font-semibold block">Total Pieces</span>
              <span className="font-bold text-base text-on-surface block mt-0.5">
                {formatPieces(totalPieces)}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold block">Items</span>
              <span className="font-bold text-base text-on-surface block mt-0.5">
                {formatItems(order.items.length)}
              </span>
            </div>
            <div>
              <span className="text-on-surface-variant font-semibold block">Total Value</span>
              <span className="font-bold text-base text-primary block mt-0.5">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Transporter Info if dispatched */}
          {order.lrNumber && (
            <div className="p-3 rounded-xl bg-primary-fixed/20 border border-primary/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">
                Transporter: {order.transporterName}
              </span>
              <span className="font-bold text-primary">LR #{order.lrNumber}</span>
            </div>
          )}
        </div>

        {/* Order Timeline */}
        <div className="bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <h3 className="font-bold text-sm text-on-surface">Order Progress</h3>
          <div className="flex flex-col gap-2 pt-1 text-xs">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    step.completed ? "bg-primary" : "bg-outline-variant"
                  }`}
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className={step.completed ? "font-bold text-on-surface" : "text-outline"}>
                    {step.stage}
                  </span>
                  {step.timestamp && (
                    <span className="text-xs text-on-surface-variant">{step.timestamp}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Items Breakdown */}
        <div className="bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <h3 className="font-bold text-sm text-on-surface">Items Ordered</h3>
          <div className="divide-y divide-surface-container/60 text-xs">
            {order.items.map((it) => (
              <div key={it.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-on-surface block">{it.productTitle}</span>
                  <span className="text-xs text-on-surface-variant">
                    {it.variant} • {it.sku}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-on-surface block">
                    {it.approvedQty || it.orderedQty} pcs
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    {formatCurrency((it.approvedQty || it.orderedQty) * it.unitPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function RetailerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-primary font-bold text-sm">Loading Order...</div>
        </div>
      }
    >
      <RetailerOrderDetailContent params={params} />
    </Suspense>
  );
}
