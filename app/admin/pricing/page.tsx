"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency } from "@/lib/formatters";

interface Override {
  id: string;
  retailerName: string;
  sku: string;
  price: number;
}

export default function AdminPricingPage() {
  const { products, retailers, updateProductPrice, showToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All brands");
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  // Category counts from real retailer database records (will be small, as expected)
  const countA2 = retailers.filter((r) => r.category === "A++").length;
  const countA1 = retailers.filter((r) => r.category === "A+").length;
  const countA = retailers.filter((r) => r.category === "A").length;

  // Local state for editable prices to track uncommitted changes
  const [editedPrices, setEditedPrices] = useState<
    Record<string, { priceA2: number; priceA1: number; priceA: number }>
  >(() => {
    const initial: Record<string, { priceA2: number; priceA1: number; priceA: number }> = {};
    products.forEach((p) => {
      const v0 = p.variants[0] || {};
      initial[p.id] = {
        priceA2: v0.priceA2 || p.basePrice,
        priceA1: v0.priceA1 || Math.round(p.basePrice * 1.06),
        priceA: v0.priceA || Math.round(p.basePrice * 1.12),
      };
    });
    return initial;
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Overrides list
  const [overrides, setOverrides] = useState<Override[]>([
    {
      id: "OVR-1",
      retailerName: "Retailer 01 - Siddipet",
      sku: "FB-LG-AF01",
      price: 235,
    },
  ]);
  const [overrideRetailer, setOverrideRetailer] = useState("Retailer 01 - Siddipet");
  const [overrideSku, setOverrideSku] = useState("FB-LG-AF01");
  const [overridePrice, setOverridePrice] = useState(235);

  const handlePriceChange = (
    productId: string,
    catKey: "priceA2" | "priceA1" | "priceA",
    val: number
  ) => {
    setEditedPrices((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { priceA2: 240, priceA1: 255, priceA: 270 }),
        [catKey]: val,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveConfirm = () => {
    setSaving(true);
    setTimeout(() => {
      Object.entries(editedPrices).forEach(([prodId, cats]) => {
        updateProductPrice(prodId, "priceA2", cats.priceA2);
        updateProductPrice(prodId, "priceA1", cats.priceA1);
        updateProductPrice(prodId, "priceA", cats.priceA);
      });
      setSaving(false);
      setShowSaveModal(false);
      setHasChanges(false);
      showToast("Wholesale price adjustments saved successfully.");
    }, 400);
  };

  const handleAddOverride = () => {
    if (!overridePrice || overridePrice <= 0) return;
    const newOvr: Override = {
      id: `OVR-${Date.now()}`,
      retailerName: overrideRetailer,
      sku: overrideSku,
      price: overridePrice,
    };
    setOverrides([newOvr, ...overrides]);
    showToast(`Added custom override for ${overrideRetailer}: ${overrideSku} @ ${formatCurrency(overridePrice)}`);
  };

  const handleDeleteOverride = (id: string) => {
    setOverrides(overrides.filter((o) => o.id !== id));
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (selectedBrand !== "All brands" && p.brand !== selectedBrand) return false;
    if (selectedCategory !== "All categories" && p.category !== selectedCategory) return false;
    if (
      searchQuery &&
      !p.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <AdminSidebar activePath="pricing" />
      <AdminHeader />

      <main className="pl-64 pt-16 min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-8 flex flex-col gap-6 pb-20 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline font-bold text-2xl lg:text-3xl text-on-surface tracking-tight">
                Wholesale Pricing
              </h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Manage wholesale rate categories (A++, A+, A) and retailer price overrides.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-on-primary text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all animate-bounce"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Price Changes</span>
                </button>
              )}
            </div>
          </div>

          {/* 3 Category Summary Cards - Dynamic counts from database */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-0">
            {/* Category A++ */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Category A++
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                  {countA2} {countA2 === 1 ? "retailer" : "retailers"}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-on-surface-variant block">Base Pricing Level</span>
                <span className="text-xl font-bold text-on-surface block mt-1">
                  Volume Category A++
                </span>
                <span className="text-xs text-on-surface-variant block mt-2">
                  Highest volume partners • Base rates
                </span>
              </div>
            </div>

            {/* Category A+ */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Category A+
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-bold text-xs">
                  {countA1} {countA1 === 1 ? "retailer" : "retailers"}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-on-surface-variant block">Standard B2B Markup</span>
                <span className="text-xl font-bold text-on-surface block mt-1">
                  Category A+ Rates
                </span>
                <span className="text-xs text-on-surface-variant block mt-2">
                  Mid volume partners • ~6% spread
                </span>
              </div>
            </div>

            {/* Category A */}
            <div className="bg-surface-container-lowest p-6 rounded-[20px] border border-outline-variant/30 shadow-[0_4px_20px_rgba(20,20,43,0.04)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-outline uppercase tracking-wider">
                  Category A
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-bold text-xs">
                  {countA} {countA === 1 ? "retailer" : "retailers"}
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-on-surface-variant block">Starting Level</span>
                <span className="text-xl font-bold text-on-surface block mt-1">
                  Category A Rates
                </span>
                <span className="text-xs text-on-surface-variant block mt-2">
                  New and smaller accounts • ~12% spread
                </span>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between flex-wrap gap-4 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3.5 py-2 bg-surface-container-low rounded-full w-64 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[18px] text-outline">search</span>
                <input
                  type="text"
                  placeholder="Search products or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-on-surface placeholder:text-outline outline-none w-full font-medium"
                />
              </div>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                <option value="All brands">All brands</option>
                {Array.from(new Set(products.map((p) => p.brand))).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-surface-container-low rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                <option value="All categories">All categories</option>
                <option value="Leggings">Leggings</option>
                <option value="Inners">Inners</option>
                <option value="Nightdresses">Nightdresses</option>
                <option value="Nighties">Nighties</option>
                <option value="Loungewear">Loungewear</option>
              </select>
            </div>

            <span className="text-xs text-on-surface-variant font-medium">
              Showing {filteredProducts.length} catalog items
            </span>
          </div>

          {/* Pricing Matrix Table - Responsive without horizontal clipping */}
          <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 min-w-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-container">
                    <th className="py-3 px-4 rounded-l-xl">Product</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3 text-right">MRP</th>
                    <th className="py-3 px-4 text-center">Category A++</th>
                    <th className="py-3 px-4 text-center">Category A+</th>
                    <th className="py-3 px-4 text-center">Category A</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">MOQ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60 font-medium">
                  {filteredProducts.map((p) => {
                    const prices = editedPrices[p.id] || {
                      priceA2: p.basePrice,
                      priceA1: Math.round(p.basePrice * 1.06),
                      priceA: Math.round(p.basePrice * 1.12),
                    };

                    return (
                      <tr key={p.id} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-on-surface">{p.title}</div>
                          <div className="text-xs text-primary font-semibold">{p.brand}</div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-on-surface-variant">
                          {p.skuCode}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-on-surface-variant">
                          {formatCurrency(p.mrp)}
                        </td>

                        {/* Category A++ Input */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/30">
                            <span className="text-xs text-outline font-semibold">Rs</span>
                            <input
                              type="number"
                              value={prices.priceA2}
                              onChange={(e) =>
                                handlePriceChange(p.id, "priceA2", Number(e.target.value) || 0)
                              }
                              className="w-16 bg-transparent text-xs font-bold text-primary text-center outline-none"
                            />
                          </div>
                        </td>

                        {/* Category A+ Input */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/30">
                            <span className="text-xs text-outline font-semibold">Rs</span>
                            <input
                              type="number"
                              value={prices.priceA1}
                              onChange={(e) =>
                                handlePriceChange(p.id, "priceA1", Number(e.target.value) || 0)
                              }
                              className="w-16 bg-transparent text-xs font-bold text-secondary text-center outline-none"
                            />
                          </div>
                        </td>

                        {/* Category A Input */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-lg border border-outline-variant/30">
                            <span className="text-xs text-outline font-semibold">Rs</span>
                            <input
                              type="number"
                              value={prices.priceA}
                              onChange={(e) =>
                                handlePriceChange(p.id, "priceA", Number(e.target.value) || 0)
                              }
                              className="w-16 bg-transparent text-xs font-bold text-on-surface text-center outline-none"
                            />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-on-surface-variant">
                          {p.moq} pcs
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overrides Section */}
          <div className="bg-surface-container-lowest rounded-[20px] p-6 shadow-sm border border-outline-variant/30 min-w-0">
            <h3 className="font-headline font-bold text-base text-on-surface mb-2">
              Retailer Price Overrides
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Contracted unit rate exceptions negotiated for specific wholesale retailers.
            </p>

            {/* Add Override Inline Controls */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container flex flex-wrap items-center gap-3 mb-4">
              <select
                value={overrideRetailer}
                onChange={(e) => setOverrideRetailer(e.target.value)}
                className="px-3 py-2 bg-surface-container-lowest rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                {retailers.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({r.category})
                  </option>
                ))}
              </select>

              <select
                value={overrideSku}
                onChange={(e) => setOverrideSku(e.target.value)}
                className="px-3 py-2 bg-surface-container-lowest rounded-xl text-xs font-semibold text-on-surface border border-outline-variant/30 outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.skuCode}>
                    {p.skuCode} - {p.title}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                <span className="text-xs font-semibold text-outline">Rs</span>
                <input
                  type="number"
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(Number(e.target.value) || 0)}
                  className="w-20 bg-transparent text-xs font-bold text-on-surface outline-none"
                />
              </div>

              <button
                onClick={handleAddOverride}
                className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
              >
                Add Override
              </button>
            </div>

            {/* Overrides Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-xs font-bold text-on-surface-variant uppercase tracking-wider border-b border-surface-container">
                    <th className="py-2.5 px-3 rounded-l-lg">Retailer</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-right">Negotiated Unit Rate</th>
                    <th className="py-2.5 px-3 text-center rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container/60 font-medium">
                  {overrides.map((ovr) => (
                    <tr key={ovr.id} className="hover:bg-surface-container-low/30">
                      <td className="py-2.5 px-3 font-bold text-on-surface">
                        {ovr.retailerName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-on-surface-variant">
                        {ovr.sku}
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-primary">
                        {formatCurrency(ovr.price)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteOverride(ovr.id)}
                          className="text-error hover:underline font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 border border-outline-variant/30 shadow-2xl flex flex-col gap-4">
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Save Price Changes
            </h3>
            <p className="text-xs text-on-surface-variant">
              Confirm updating wholesale prices across Category A++, Category A+, and Category A.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfirm}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm"
              >
                {saving ? "Saving..." : "Confirm Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

