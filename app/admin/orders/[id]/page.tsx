"use client";

import { useState, use, Suspense } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatItems, formatPieces } from "@/lib/formatters";

function OrderReviewContent({ orderId }: { orderId: string }) {
  const { orders, updateOrderItemQty, confirmOrder, rejectOrder, cancelOrder, showToast } =
    useAppStore();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const totalOrdered = order.items.reduce((acc, it) => acc + it.orderedQty, 0);
  const totalApproved = order.items.reduce((acc, it) => acc + it.approvedQty, 0);
  
  // A submitted order displays its requested quantities & amounts. Approved quantities appear after review.
  const isSubmitted = order.status === "Submitted";
  const displayPieces = isSubmitted ? totalOrdered : totalApproved;
  const displayAmount = isSubmitted
    ? order.totalAmount
    : order.items.reduce((acc, it) => acc + it.approvedQty * it.unitPrice, 0);

  const rowsShort = order.items.filter((it) => it.availableStock < it.orderedQty).length;
  const rowsOk = order.items.length - rowsShort;

  const handleConfirm = () => {
    confirmOrder(order.id);
    setShowConfirmModal(false);
    showToast(`Order ${order.orderNo} confirmed! Sent to Dispatch.`);
  };

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this order?")) {
      rejectOrder(order.id);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrder(order.id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="orders" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 min-w-0">
          {/* Top Breadcrumb & Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <nav className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <Link
                  href="/admin/orders"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Orders</span>
                </Link>
                <span>/</span>
                <span className="text-primary font-mono">{order.orderNo}</span>
              </nav>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-on-surface font-headline tracking-tight">
                  Review Order {order.orderNo}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === "Submitted"
                      ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                      : order.status === "Confirmed"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/orders/${order.id}/print`}
                className="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Print Packing Slip</span>
              </Link>

              {isSubmitted && (
                <>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2.5 rounded-full bg-error-container/40 hover:bg-error-container text-error text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-bold shadow-[0_4px_16px_rgba(65,63,214,0.35)] hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Confirm Order</span>
                  </button>
                </>
              )}

              {order.status === "Confirmed" && (
                <Link
                  href="/admin/dispatch"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-secondary to-primary-container text-on-primary text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  <span>Proceed to Dispatch</span>
                </Link>
              )}
            </div>
          </div>

          {/* Retailer Meta Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-w-0">
            <div className="bg-surface-container-lowest p-5 rounded-[20px] border border-outline-variant/30 shadow-[0_1px_4px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Retailer Account
              </span>
              <div className="mt-2">
                <span className="text-base font-bold text-on-surface block leading-tight">
                  {order.retailerName}
                </span>
                <span className="text-xs text-on-surface-variant mt-0.5 block">{order.region}</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-[20px] border border-outline-variant/30 shadow-[0_1px_4px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Category
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-primary">{order.category}</span>
                <span className="text-xs text-on-surface-variant font-medium">Pricing Band</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-[20px] border border-outline-variant/30 shadow-[0_1px_4px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {isSubmitted ? "Requested Quantity" : "Approved Quantity"}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-on-surface">{displayPieces}</span>
                <span className="text-xs text-on-surface-variant">
                  {isSubmitted ? "pcs requested" : "pcs approved"}
                </span>
              </div>
              <span className="text-xs text-outline mt-2">{formatItems(order.items.length)}</span>
            </div>

            <div className="bg-surface-container-lowest p-5 rounded-[20px] border border-outline-variant/30 shadow-[0_1px_4px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {isSubmitted ? "Requested Value" : "Approved Value"}
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-black text-on-surface">
                  {formatCurrency(displayAmount)}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant mt-2">
                Status: {order.status}
              </span>
            </div>
          </div>

          {/* Shortage Warning Notice (if any) */}
          {rowsShort > 0 && isSubmitted && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm text-amber-950">
              <span className="material-symbols-outlined text-amber-700 text-[22px] shrink-0 mt-0.5">
                warning
              </span>
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Shortage Detected ({rowsShort} {rowsShort === 1 ? "line item" : "line items"})
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Some requested quantities exceed available inventory. Adjust approved quantity
                    using the steppers below or add inbound stock before confirming.
                  </p>
                </div>
                <Link
                  href="/admin/inventory"
                  className="px-3.5 py-1.5 rounded-full bg-amber-200/70 hover:bg-amber-200 text-amber-950 text-xs font-bold shrink-0 self-start md:self-auto transition-colors"
                >
                  Check Inventory
                </Link>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div className="bg-surface-container-lowest rounded-[24px] border border-outline-variant/30 shadow-[0_1px_4px_rgba(20,20,43,0.04)] overflow-hidden flex flex-col min-w-0">
            <div className="p-5 border-b border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-headline font-bold text-base text-on-surface">
                  Order Line Items
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  ({formatItems(order.items.length)})
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>{rowsOk} In Stock</span>
                </span>
                {rowsShort > 0 && (
                  <span className="inline-flex items-center gap-1 text-amber-800 font-semibold ml-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{rowsShort} Shortage</span>
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-container">
                    <th className="py-3 px-5">Item & Brand</th>
                    <th className="py-3 px-4">SKU / Variant</th>
                    <th className="py-3 px-4 text-center">Available</th>
                    <th className="py-3 px-4 text-right">Requested</th>
                    <th className="py-3 px-6 text-center">Approved Qty</th>
                    <th className="py-3 px-4 text-right">Unit Rate</th>
                    <th className="py-3 px-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60 font-medium">
                  {order.items.map((item) => {
                    const isShort = item.availableStock < item.orderedQty;
                    const subtotal = item.approvedQty * item.unitPrice;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-surface-container-low/40 transition-colors ${
                          isShort && isSubmitted ? "bg-amber-50/40" : ""
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                              style={{ backgroundColor: item.colorHex }}
                              title={item.color}
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-on-surface text-sm">
                                {item.productTitle}
                              </span>
                              <span className="text-xs text-primary font-semibold uppercase tracking-wider">
                                {item.brand}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-on-surface-variant">
                          <div>{item.sku}</div>
                          <div className="text-on-surface font-semibold">{item.variant}</div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full ${
                              item.availableStock >= item.orderedQty
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {formatPieces(item.availableStock)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-semibold text-on-surface">
                          {formatPieces(item.orderedQty)}
                        </td>

                        {/* Approved Quantity Stepper */}
                        <td className="py-3.5 px-6 text-center">
                          {isSubmitted ? (
                            <div className="inline-flex items-center rounded-xl border border-outline-variant/40 bg-surface-container-low p-1 shadow-xs">
                              <button
                                onClick={() =>
                                  updateOrderItemQty(
                                    order.id,
                                    item.id,
                                    Math.max(0, item.approvedQty - 1)
                                  )
                                }
                                className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface font-bold text-sm transition-colors"
                              >
                                -
                              </button>
                              <span className="w-10 text-center font-bold text-on-surface text-sm">
                                {item.approvedQty}
                              </span>
                              <button
                                onClick={() =>
                                  updateOrderItemQty(order.id, item.id, item.approvedQty + 1)
                                }
                                className="w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface font-bold text-sm transition-colors"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <span className="font-bold text-sm text-on-surface">
                              {formatPieces(item.approvedQty)}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right text-on-surface-variant font-medium">
                          {formatCurrency(item.unitPrice)}
                        </td>

                        <td className="py-3.5 px-5 text-right font-bold text-on-surface">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-5 bg-surface-container-low border-t border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-xs text-on-surface-variant">
                <span>Payment Term: Standard B2B</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block text-xs text-on-surface-variant">Total Quantity</span>
                  <span className="font-bold text-sm text-on-surface">
                    {formatPieces(displayPieces)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-on-surface-variant">Total Order Value</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(displayAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 border border-outline-variant/30 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">check_circle</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  Confirm Order {order.orderNo}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Confirm and release {formatPieces(totalApproved)} for packing.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Retailer:</span>
                <span className="font-semibold text-on-surface">{order.retailerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Approved Pieces:</span>
                <span className="font-semibold text-on-surface">{formatPieces(totalApproved)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Invoice Value:</span>
                <span className="font-bold text-primary">{formatCurrency(displayAmount)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
              >
                Confirm and Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrderReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-primary font-bold text-sm">Loading Order...</div>
        </div>
      }
    >
      <OrderReviewContent orderId={resolved.id} />
    </Suspense>
  );
}

