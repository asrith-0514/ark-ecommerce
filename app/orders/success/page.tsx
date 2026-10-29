"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import StoreNav from "@/components/StoreNav";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPieces, formatItems } from "@/lib/formatters";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { orders, activeRetailer } = useAppStore();

  const orderNo = searchParams.get("orderNo") || "ORD-8830";
  const order = orders.find((o) => o.orderNo === orderNo) || orders[0];

  const totalPieces =
    order.items && order.items.length > 0
      ? order.items.reduce((acc, it) => acc + (it.approvedQty || it.orderedQty), 0)
      : order.approvedPieces || 58;

  const totalAmount =
    order.items && order.items.length > 0
      ? order.items.reduce(
          (acc, it) => acc + (it.approvedQty || it.orderedQty) * it.unitPrice,
          0
        )
      : order.totalAmount || 13500;

  const itemsCount = order.items && order.items.length > 0 ? order.items.length : 3;

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="relative w-full flex flex-col gap-4">
        {/* Top Identity & Retailer Context Sub-Header */}
        <div className="w-full flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
            <span className="text-base font-bold text-on-surface tracking-tight font-headline">
              ARK Connect
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container shadow-sm">
            <span
              className="material-symbols-outlined text-[16px] text-tertiary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
            <span className="text-xs font-semibold text-on-surface truncate max-w-[140px]">
              {activeRetailer.name}
            </span>
            <span className="material-symbols-outlined text-[14px] text-tertiary font-bold">
              verified
            </span>
          </div>
        </div>

        {/* Centered Hero Success Bento Card */}
        <div className="w-full bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center text-center relative overflow-hidden">
          {/* Animated Concentric Success Icon */}
          <div className="relative flex items-center justify-center my-2">
            <div className="relative w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
              <span className="material-symbols-outlined text-[32px] font-bold">
                check
              </span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="mt-3 text-2xl font-bold text-on-surface tracking-tight font-headline">
            Order submitted
          </h2>

          {/* Order ID Pill Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-surface-container shadow-xs">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
              Ref
            </span>
            <span className="text-xs font-bold text-primary tracking-tight font-mono">
              {order.orderNo}
            </span>
          </div>

          <p className="mt-2 text-xs text-on-surface-variant max-w-[280px]">
            ARK will review your wholesale order and reserve warehouse stock soon.
          </p>
        </div>

        {/* Wholesale Order Overview Card */}
        <div className="w-full bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface font-headline">
              Order overview
            </span>
            <span className="text-xs text-on-surface font-semibold">
              {order.retailerName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-container-low text-xs">
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant uppercase font-semibold">
                Total pieces
              </span>
              <span className="text-lg leading-tight text-on-surface font-bold mt-0.5">
                {formatPieces(totalPieces)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant uppercase font-semibold">
                Items
              </span>
              <span className="text-lg leading-tight text-on-surface font-bold mt-0.5">
                {formatItems(itemsCount)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-on-surface-variant uppercase font-semibold">
                Est. total
              </span>
              <span className="text-lg leading-tight text-primary font-bold mt-0.5">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Retailer Note Card */}
        {order.retailerNote && (
          <div className="w-full bg-surface-container-lowest rounded-[20px] p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-1.5">
            <span className="text-xs font-bold text-on-surface font-headline">
              Your note to ARK
            </span>
            <p className="text-xs text-on-surface bg-surface-container-low px-3 py-2 rounded-xl italic">
              “{order.retailerNote}”
            </p>
          </div>
        )}

        {/* Mini "What happens next" Status Timeline Bento Card */}
        <div className="w-full bg-surface-container-lowest rounded-[20px] p-5 shadow-sm border border-outline-variant/30 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">route</span>
            <span className="text-sm font-bold text-on-surface font-headline">
              What happens next
            </span>
          </div>

          <div className="flex flex-col relative pl-1 text-xs">
            <div className="absolute left-[13px] top-3 bottom-3 w-[2px] bg-surface-variant rounded-full"></div>
            <div className="flex items-center gap-3 relative pb-4">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 z-10 shadow-xs font-bold">
                <span className="material-symbols-outlined text-[15px]">check</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-on-surface">Order submitted</span>
                <span className="text-xs text-outline">Received by ARK operations</span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative pb-4">
              <div className="w-6 h-6 rounded-full bg-surface-container text-outline flex items-center justify-center shrink-0 z-10 font-bold">
                <span className="material-symbols-outlined text-[15px]">inventory_2</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-on-surface-variant">ARK reviews and confirms</span>
                <span className="text-xs text-outline">Stock check and confirmation</span>
              </div>
            </div>

            <div className="flex items-center gap-3 relative">
              <div className="w-6 h-6 rounded-full bg-surface-container text-outline flex items-center justify-center shrink-0 z-10 font-bold">
                <span className="material-symbols-outlined text-[15px]">local_shipping</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-on-surface-variant">Order dispatched</span>
                <span className="text-xs text-outline">Transport and parcel details updated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          <Link
            href="/orders"
            className="w-full h-12 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.98] transition-all"
          >
            <span>View my orders</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>

          <Link
            href="/shop"
            className="w-full h-12 rounded-full bg-surface-container-lowest text-on-surface text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-surface-container active:scale-[0.98] transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              arrow_back
            </span>
            <span>Back to shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="bg-[#fcf8ff] min-h-screen text-on-surface antialiased flex flex-col">
      <StoreNav />

      <main className="flex-1 flex flex-col relative w-full pt-16 max-w-md mx-auto px-4 md:px-6">
        <Suspense fallback={<div className="p-8 text-center text-xs">Loading order confirmation...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}

