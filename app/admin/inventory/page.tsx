"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { ProductVariant } from "@/lib/data";
import { formatCurrency, formatPieces } from "@/lib/formatters";

export default function AdminInventoryPage() {
  const { products, addStock, showToast } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All brands");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Inbound Stock Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeVariant, setActiveVariant] = useState<{
    variant: ProductVariant;
    productTitle: string;
    productSku: string;
  } | null>(null);
  const [addQty, setAddQty] = useState(24);
  const [lotNote, setLotNote] = useState("Lot #26-OCT");

  // Flatten all variants with their parent product info
  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      productTitle: p.title,
      productSku: p.skuCode,
      brand: p.brand,
      category: p.category,
      variant: v,
    }))
  );

  const filteredVariants = allVariants.filter((item) => {
    if (selectedBrand !== "All brands" && item.brand !== selectedBrand) return false;
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (selectedStatus === "Out of stock" && item.variant.availableStock !== 0) return false;
    if (selectedStatus === "Low stock" && (item.variant.availableStock === 0 || item.variant.availableStock >= 15)) return false;
    if (selectedStatus === "In stock" && item.variant.availableStock < 15) return false;
    if (
      search &&
      !item.productTitle.toLowerCase().includes(search.toLowerCase()) &&
      !item.variant.sku.toLowerCase().includes(search.toLowerCase()) &&
      !item.variant.color.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalPhysical = allVariants.reduce((acc, it) => acc + it.variant.physicalStock, 0);
  const totalReserved = allVariants.reduce((acc, it) => acc + it.variant.reservedStock, 0);
  const totalAvailable = totalPhysical - totalReserved; // Available = Physical - Reserved
  const outOfStockCount = allVariants.filter((it) => it.variant.availableStock === 0).length;

  const handleOpenAddStock = (item: (typeof allVariants)[0]) => {
    setActiveVariant({
      variant: item.variant,
      productTitle: item.productTitle,
      productSku: item.productSku,
    });
    setAddQty(24);
    setShowAddModal(true);
  };

  const handleConfirmAddStock = () => {
    if (!activeVariant) return;
    addStock(activeVariant.variant.id, addQty);
    setShowAddModal(false);
    showToast(`Added ${addQty} pcs to ${activeVariant.variant.sku}`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="inventory" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 min-w-0">
          {/* 1. Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
                Inventory
              </h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Physical, reserved and available stock by variant. Available = Physical - Reserved.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const defaultItem = allVariants[0];
                  if (defaultItem) handleOpenAddStock(defaultItem);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add_box</span>
                <span>Add Inbound Stock</span>
              </button>
            </div>
          </div>

          {/* 2. Four Operational Metric Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
            {/* Metric 1: Total SKUs */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Total Active SKUs
                </span>
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">layers</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-on-surface">
                  {allVariants.length}
                </span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Across {products.length} catalog styles
                </span>
              </div>
            </div>

            {/* Metric 2: Physical Stock */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Physical Stock
                </span>
                <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">inventory</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-on-surface">
                  {totalPhysical}
                </span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Total pieces on shelves
                </span>
              </div>
            </div>

            {/* Metric 3: Reserved Stock */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Reserved Stock
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
                  <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-amber-900">
                  {totalReserved}
                </span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Allocated to open orders
                </span>
              </div>
            </div>

            {/* Metric 4: Out of Stock Count */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  Out of Stock Variants
                </span>
                <div className="w-9 h-9 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-[20px]">error_outline</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-error">
                  {outOfStockCount}
                </span>
                <span className="block text-xs text-on-surface-variant mt-1">
                  Variants with available = 0
                </span>
              </div>
            </div>
          </div>

          {/* 3. Search & Filter Bar */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-4 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low rounded-full w-64 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[18px] text-outline">search</span>
                <input
                  type="text"
                  placeholder="Search SKU, product, color..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs text-on-surface placeholder:text-outline outline-none w-full font-medium"
                />
              </div>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                <option value="All brands">All brands</option>
                {Array.from(new Set(products.map((p) => p.brand))).map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                <option value="All">All categories</option>
                <option value="Leggings">Leggings</option>
                <option value="Inners">Inners</option>
                <option value="Nightdresses">Nightdresses</option>
                <option value="Nighties">Nighties</option>
                <option value="Loungewear">Loungewear</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                <option value="All">All stock levels</option>
                <option value="In stock">In stock (≥15)</option>
                <option value="Low stock">Low stock (&lt;15)</option>
                <option value="Out of stock">Out of stock (=0)</option>
              </select>
            </div>

            <div className="text-xs text-on-surface-variant font-medium">
              Showing {filteredVariants.length} of {allVariants.length} variants
            </div>
          </div>

          {/* 4. Inventory Matrix Table */}
          <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-container">
                    <th className="py-3 px-4 rounded-l-xl">Product & Brand</th>
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4 text-right">Physical</th>
                    <th className="py-3 px-4 text-right">Reserved</th>
                    <th className="py-3 px-4 text-right">Available</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60 font-medium">
                  {filteredVariants.map((item) => {
                    const v = item.variant;
                    // Available = Physical - Reserved strictly calculated
                    const computedAvailable = Math.max(0, v.physicalStock - v.reservedStock);
                    const isOut = computedAvailable === 0;
                    const isLow = computedAvailable > 0 && computedAvailable < 15;

                    return (
                      <tr key={v.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-on-surface">{item.productTitle}</div>
                          <div className="text-xs text-primary font-semibold">{item.brand}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-on-surface-variant">
                          {v.sku}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-on-surface">
                          {v.size}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: v.colorHex }}
                            />
                            <span>{v.color}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-on-surface">
                          {v.physicalStock}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-amber-700">
                          {v.reservedStock}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-sm text-primary">
                          {computedAvailable}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {isOut ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold bg-error-container text-on-error-container text-xs">
                              Out of stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 text-xs">
                              Low stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-xs">
                              In stock
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenAddStock(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span>Add Stock</span>
                          </button>
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

      {/* Inbound Stock Modal */}
      {showAddModal && activeVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 border border-outline-variant/30 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">add_box</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  Add Inbound Stock
                </h3>
                <p className="text-xs text-on-surface-variant font-mono">
                  {activeVariant.variant.sku}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low text-xs flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Product:</span>
                <span className="font-bold text-on-surface">{activeVariant.productTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Size / Color:</span>
                <span className="font-semibold text-on-surface">
                  {activeVariant.variant.size} • {activeVariant.variant.color}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Current Physical:</span>
                <span className="font-bold text-on-surface">
                  {activeVariant.variant.physicalStock} pcs
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Current Available:</span>
                <span className="font-bold text-primary">
                  {activeVariant.variant.availableStock} pcs
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Quantity to Add (pcs)
                </label>
                <div className="flex items-center gap-2">
                  {[12, 24, 48, 96].map((quick) => (
                    <button
                      key={quick}
                      onClick={() => setAddQty(quick)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                        addQty === quick
                          ? "bg-primary text-on-primary border-primary"
                          : "bg-surface-container text-on-surface border-outline-variant/30"
                      }`}
                    >
                      +{quick}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    value={addQty}
                    onChange={(e) => setAddQty(Number(e.target.value) || 0)}
                    className="w-20 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface text-center outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Lot / Note
                </label>
                <input
                  type="text"
                  value={lotNote}
                  onChange={(e) => setLotNote(e.target.value)}
                  placeholder="Optional lot or notes"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs font-medium text-on-surface outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddStock}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
              >
                Record Inbound (+{addQty} pcs)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

