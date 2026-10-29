"use client";

import React, { useState } from "react";
import Link from "next/link";
import StoreNav from "@/components/StoreNav";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPieces } from "@/lib/formatters";

export default function RetailerOrdersPage() {
  const { orders, activeRetailer, addToCart, showToast } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const retailerOrders = orders.filter(
    (o) => o.retailerId === activeRetailer.id || o.retailerName.includes("Siddipet")
  );

  const filteredOrders = retailerOrders.filter((o) => {
    if (filterStatus === "all") return true;
    return o.status === filterStatus;
  });

  const handleReorder = (e: React.MouseEvent, order: (typeof orders)[0]) => {
    e.stopPropagation();
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-xl text-on-surface">Order History</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Track your wholesale consignments and status.
            </p>
          </div>
          <Link
            href="/shop"
            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs"
          >
            + New Order
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {["all", "Submitted", "Confirmed", "Packing", "Partially Dispatched", "Dispatched", "Delivered"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {status === "all" ? "All Orders" : status}
              </button>
            )
          )}
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/30 text-xs text-on-surface-variant">
              No orders found for this status.
            </div>
          ) : (
            filteredOrders.map((order) => {
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
                  : "bg-surface-container text-on-surface-variant border-outline-variant/30";

              return (
                <div
                  key={order.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-on-surface">{order.orderNo}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${statusClass}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">{order.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-surface-container">
                    <div>
                      <span className="text-on-surface-variant block">Total Quantity</span>
                      <span className="font-bold text-on-surface text-sm">
                        {formatPieces(order.totalPieces)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-on-surface-variant block">Total Value</span>
                      <span className="font-bold text-primary text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>

                    <button
                      onClick={(e) => handleReorder(e, order)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
