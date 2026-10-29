"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPieces } from "@/lib/formatters";

export default function AdminDispatchPage() {
  const { orders, dispatchOrder, showToast } = useAppStore();

  // Dispatch queue lists ONLY Confirmed, Packing and Partially Dispatched orders
  const dispatchEligibleOrders = orders.filter(
    (o) => o.status === "Confirmed" || o.status === "Packing" || o.status === "Partially Dispatched"
  );

  const [activeTab, setActiveTab] = useState<"All" | "Confirmed" | "Packing" | "Partially Dispatched">("All");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("ORD-8830");

  // Placeholders as required: "Enter transport name", "Optional parcel/LR number", "Add a note"
  // Do NOT pre-fill transport name or parcel number
  const [transporter, setTransporter] = useState("");
  const [lrNumber, setLrNumber] = useState("");
  const [dispatchNote, setDispatchNote] = useState("");

  const selectedOrder =
    dispatchEligibleOrders.find((o) => o.id === selectedOrderId) ||
    dispatchEligibleOrders[0] ||
    orders[0];

  // Agreed demo example: Black-M 12, Navy-L 5 of 8, White-M 10 = 27 pcs, 3 stay reserved
  const [dispatchNowMap, setDispatchNowMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    if (selectedOrder) {
      selectedOrder.items.forEach((item) => {
        if (item.sku === "FB-LG-AF01") {
          map[item.id] = 12; // Black-M 12
        } else if (item.sku === "FC-LG-RG04") {
          map[item.id] = 5; // Navy-L 5 of 8
        } else if (item.sku === "EX-IN-MS02") {
          map[item.id] = 10; // White-M 10
        } else {
          map[item.id] = item.approvedQty;
        }
      });
    }
    return map;
  });

  const handleUpdateDispatchQty = (itemId: string, newQty: number, maxQty: number) => {
    setDispatchNowMap((prev) => ({
      ...prev,
      [itemId]: Math.max(0, Math.min(newQty, maxQty)),
    }));
  };

  const totalDispatchingNow = selectedOrder
    ? selectedOrder.items.reduce(
        (acc, it) => acc + (dispatchNowMap[it.id] ?? it.approvedQty),
        0
      )
    : 0;

  const totalApproved = selectedOrder
    ? selectedOrder.items.reduce((acc, it) => acc + it.approvedQty, 0)
    : 0;

  const totalStayingReserved = Math.max(0, totalApproved - totalDispatchingNow);

  const handleRecordDispatch = () => {
    if (!selectedOrder) return;
    dispatchOrder(selectedOrder.id, dispatchNowMap, transporter, lrNumber, dispatchNote);
    showToast(`Dispatch recorded for ${selectedOrder.orderNo}!`);
  };

  // Filter orders according to active tab
  const filteredOrders = dispatchEligibleOrders.filter((o) => {
    if (activeTab !== "All" && o.status !== activeTab) return false;
    if (
      search &&
      !o.orderNo.toLowerCase().includes(search.toLowerCase()) &&
      !o.retailerName.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // KPI Calculations from real records
  const confirmedCount = dispatchEligibleOrders.filter((o) => o.status === "Confirmed").length;
  const packingCount = dispatchEligibleOrders.filter((o) => o.status === "Packing").length;
  const partiallyDispatchedCount = dispatchEligibleOrders.filter(
    (o) => o.status === "Partially Dispatched"
  ).length;

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="dispatch" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 pb-16 min-w-0">
          {/* 1. Page Header */}
          <div className="flex flex-col gap-1">
            <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
              Dispatch
            </h1>
            <p className="text-sm text-on-surface-variant">
              Pack confirmed orders and record what was sent.
            </p>
          </div>

          {/* 2. Summary Row of 3 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 min-w-0">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                <span>Confirmed to Pack</span>
                <span className="material-symbols-outlined text-[20px] text-primary">
                  assignment_turned_in
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold text-on-surface">{confirmedCount}</span>
                <span className="text-xs text-on-surface-variant">orders</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                <span>Packing Floor</span>
                <span className="material-symbols-outlined text-[20px] text-amber-700">
                  package_2
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold text-amber-800">{packingCount}</span>
                <span className="text-xs text-on-surface-variant">orders being packed</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant text-xs font-bold uppercase tracking-wider">
                <span>Partially Dispatched</span>
                <span className="material-symbols-outlined text-[20px] text-blue-700">
                  local_shipping
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-3xl font-bold text-blue-900">{partiallyDispatchedCount}</span>
                <span className="text-xs text-on-surface-variant">balance pending</span>
              </div>
            </div>
          </div>

          {/* 3. Main Workspace: Order Queue on left, Active Dispatch Console on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
            {/* Left Column: Eligible Orders List */}
            <div className="lg:col-span-4 flex flex-col gap-4 min-w-0">
              <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-headline font-bold text-sm text-on-surface">
                    Dispatch Queue
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {dispatchEligibleOrders.length} orders
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {(["All", "Confirmed", "Packing", "Partially Dispatched"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-outline">search</span>
                  <input
                    type="text"
                    placeholder="Search queue..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none w-full text-xs text-on-surface placeholder:text-outline"
                  />
                </div>

                {/* Orders list */}
                <div className="flex flex-col gap-2 mt-1 max-h-[500px] overflow-y-auto">
                  {filteredOrders.length === 0 ? (
                    <div className="p-6 text-center text-xs text-on-surface-variant">
                      No matching orders in dispatch queue.
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isSelected = order.id === selectedOrder?.id;
                      return (
                        <div
                          key={order.id}
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            // Set initial dispatch map for the selected order
                            const initialMap: Record<string, number> = {};
                            order.items.forEach((item) => {
                              if (order.id === "ORD-8830") {
                                if (item.sku === "FB-LG-AF01") initialMap[item.id] = 12;
                                else if (item.sku === "FC-LG-RG04") initialMap[item.id] = 5;
                                else if (item.sku === "EX-IN-MS02") initialMap[item.id] = 10;
                                else initialMap[item.id] = item.approvedQty;
                              } else {
                                initialMap[item.id] = item.approvedQty;
                              }
                            });
                            setDispatchNowMap(initialMap);
                          }}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary-fixed/20 border-primary shadow-xs"
                              : "bg-surface-container-low/60 border-outline-variant/30 hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-on-surface">{order.orderNo}</span>
                            <span className="font-semibold text-primary px-2 py-0.5 rounded-full bg-surface-container text-xs">
                              {order.category}
                            </span>
                          </div>
                          <div className="font-medium text-on-surface truncate">
                            {order.retailerName}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-on-surface-variant">
                            <span>{formatPieces(order.approvedPieces)}</span>
                            <span className="font-semibold text-on-surface">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Dispatch Action Sheet */}
            {selectedOrder ? (
              <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
                <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
                  {/* Selected Order Summary */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-surface-container">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-headline font-bold text-lg text-on-surface">
                          Dispatching {selectedOrder.orderNo}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                          {selectedOrder.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {selectedOrder.retailerName} • {selectedOrder.region} • Category:{" "}
                        <strong>{selectedOrder.category}</strong>
                      </p>
                    </div>

                    <Link
                      href={`/admin/orders/${selectedOrder.id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1 self-start md:self-auto"
                    >
                      <span>View Full Order</span>
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    </Link>
                  </div>

                  {/* Line Items Steppers: Example ORD-8830 (27 pcs dispatched, 3 reserved) */}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-3">
                      Line Item Dispatch Quantities
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                            <th className="py-2.5 px-3 rounded-l-lg">Item</th>
                            <th className="py-2.5 px-3">SKU</th>
                            <th className="py-2.5 px-3 text-right">Approved</th>
                            <th className="py-2.5 px-3 text-center">Dispatching Now</th>
                            <th className="py-2.5 px-3 text-right rounded-r-lg">Remaining</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container/60 font-medium">
                          {selectedOrder.items.map((item) => {
                            const nowQty = dispatchNowMap[item.id] ?? item.approvedQty;
                            const remaining = Math.max(0, item.approvedQty - nowQty);

                            return (
                              <tr key={item.id} className="hover:bg-surface-container-low/30">
                                <td className="py-3 px-3">
                                  <div className="font-bold text-on-surface">
                                    {item.productTitle}
                                  </div>
                                  <div className="text-on-surface-variant text-xs">
                                    {item.variant}
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-mono text-on-surface-variant">
                                  {item.sku}
                                </td>
                                <td className="py-3 px-3 text-right font-semibold text-on-surface">
                                  {item.approvedQty}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <div className="inline-flex items-center rounded-lg border border-outline-variant/30 bg-surface-container-low p-0.5">
                                    <button
                                      onClick={() =>
                                        handleUpdateDispatchQty(
                                          item.id,
                                          nowQty - 1,
                                          item.approvedQty
                                        )
                                      }
                                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-on-surface hover:bg-surface-container"
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center font-bold text-on-surface">
                                      {nowQty}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleUpdateDispatchQty(
                                          item.id,
                                          nowQty + 1,
                                          item.approvedQty
                                        )
                                      }
                                      className="w-6 h-6 rounded flex items-center justify-center font-bold text-on-surface hover:bg-surface-container"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-right font-bold text-amber-700">
                                  {remaining > 0 ? `${remaining} reserved` : "0"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                    <div>
                      <span className="text-on-surface-variant">Dispatching now: </span>
                      <strong className="text-primary font-bold text-sm">
                        {formatPieces(totalDispatchingNow)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Staying reserved: </span>
                      <strong className="text-amber-700 font-bold text-sm">
                        {formatPieces(totalStayingReserved)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-on-surface-variant">Total approved: </span>
                      <strong className="text-on-surface font-bold text-sm">
                        {formatPieces(totalApproved)}
                      </strong>
                    </div>
                  </div>

                  {/* Transport & Parcel Inputs with Exact Placeholders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Transport Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter transport name"
                        value={transporter}
                        onChange={(e) => setTransporter(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface outline-none focus:border-primary placeholder:text-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Parcel / LR Number
                      </label>
                      <input
                        type="text"
                        placeholder="Optional parcel/LR number"
                        value={lrNumber}
                        onChange={(e) => setLrNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface outline-none focus:border-primary placeholder:text-outline"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-on-surface mb-1">
                        Dispatch Note
                      </label>
                      <input
                        type="text"
                        placeholder="Add a note"
                        value={dispatchNote}
                        onChange={(e) => setDispatchNote(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface outline-none focus:border-primary placeholder:text-outline"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
                    <button
                      onClick={handleRecordDispatch}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      <span>Record Dispatch ({totalDispatchingNow} pcs)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

