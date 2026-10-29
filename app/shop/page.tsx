"use client";

import React, { useState } from "react";
import Link from "next/link";
import StoreNav from "@/components/StoreNav";
import { useAppStore, CartItem } from "@/lib/store-context";
import { Product } from "@/lib/data";
import { formatCurrency, formatPieces } from "@/lib/formatters";

export default function ShopCatalogPage() {
  const { products, activeRetailer, cart, addToCart, showToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");

  // State for Bulk Pack Matrix Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeColorway, setActiveColorway] = useState<string>("");
  const [matrixQtys, setMatrixQtys] = useState<Record<string, number>>({});

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    const matchBrand = selectedBrand === "All" || p.brand === selectedBrand;

    const matchSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.skuCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchBrand && matchSearch;
  });

  const totalCartPieces = cart.reduce((acc, it) => acc + it.qty, 0);
  const totalCartAmount = cart.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);

  const handleOpenMatrix = (prod: Product) => {
    setSelectedProduct(prod);
    const initialColor = prod.colorways[0]?.name || prod.variants[0]?.color || "Default";
    setActiveColorway(initialColor);

    const qtys: Record<string, number> = {};
    prod.variants.forEach((v) => {
      const inCart = cart.find((c) => c.variantId === v.id);
      qtys[v.id] = inCart ? inCart.qty : 0;
    });
    setMatrixQtys(qtys);
  };

  const handleStepQty = (variantId: string, delta: number) => {
    setMatrixQtys((prev) => ({
      ...prev,
      [variantId]: Math.max(0, (prev[variantId] || 0) + delta),
    }));
  };

  const handleApplyPreset = (type: "clear" | "standard24") => {
    if (!selectedProduct) return;
    const variantsInColor = selectedProduct.variants.filter(
      (v) => v.color.toLowerCase() === activeColorway.toLowerCase()
    );

    if (type === "clear") {
      const cleared: Record<string, number> = { ...matrixQtys };
      variantsInColor.forEach((v) => {
        cleared[v.id] = 0;
      });
      setMatrixQtys(cleared);
    } else if (type === "standard24") {
      const updated: Record<string, number> = { ...matrixQtys };
      variantsInColor.forEach((v) => {
        if (v.status !== "out_of_stock") {
          updated[v.id] = v.size === "M" || v.size === "L" ? 8 : 4;
        }
      });
      setMatrixQtys(updated);
    }
  };

  const handleCommitMatrixToCart = () => {
    if (!selectedProduct) return;
    let addedCount = 0;

    Object.entries(matrixQtys).forEach(([variantId, qty]) => {
      if (qty <= 0) return;
      const variant = selectedProduct.variants.find((v) => v.id === variantId);
      if (!variant) return;

      const unitPrice =
        activeRetailer.category === "A++"
          ? variant.priceA2
          : activeRetailer.category === "A+"
          ? variant.priceA1
          : variant.priceA;

      const item: CartItem = {
        productId: selectedProduct.id,
        variantId: variant.id,
        productTitle: selectedProduct.title,
        brand: selectedProduct.brand,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        colorHex: variant.colorHex,
        qty,
        unitPrice,
      };

      addToCart(item);
      addedCount += qty;
    });

    if (addedCount > 0) {
      showToast(`Added ${addedCount} pcs to your cart`);
    }
    setSelectedProduct(null);
  };

  return (
    <div className="bg-[#fcf8ff] min-h-screen text-on-surface antialiased pb-28">
      <StoreNav />

      {/* Main Container */}
      <main className="pt-20 px-4 md:px-6 max-w-4xl mx-auto flex flex-col gap-6">
        {/* Retailer Category Banner */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-on-surface-variant block">Logged In Dealer</span>
            <span className="font-bold text-sm text-on-surface">{activeRetailer.name}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-on-surface-variant block">Pricing Category</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-xs bg-primary text-on-primary">
              {activeRetailer.category}
            </span>
          </div>
        </div>

        {/* Search & Filter Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest rounded-full border border-outline-variant/30 shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-outline">search</span>
            <input
              type="text"
              placeholder="Search wholesale products, brands, SKUs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-on-surface placeholder:text-outline outline-none w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {["All", "Leggings", "Inners", "Nightdresses", "Nighties", "Loungewear"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((p) => {
            const v0 = p.variants[0];
            const price =
              activeRetailer.category === "A++"
                ? v0?.priceA2 || p.basePrice
                : activeRetailer.category === "A+"
                ? v0?.priceA1 || Math.round(p.basePrice * 1.06)
                : v0?.priceA || Math.round(p.basePrice * 1.12);

            const totalAvail = p.variants.reduce((sum, v) => sum + v.availableStock, 0);

            return (
              <div
                key={p.id}
                className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {p.brand}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">{p.skuCode}</span>
                  </div>
                  <h3 className="font-bold text-base text-on-surface leading-snug">{p.title}</h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2">{p.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                  <div>
                    <span className="text-xs text-on-surface-variant block">Wholesale Rate</span>
                    <span className="font-bold text-base text-on-surface">
                      {formatCurrency(price)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenMatrix(p)}
                    className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
                  >
                    Select Sizes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalCartPieces > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40">
          <Link
            href="/cart"
            className="flex items-center justify-between p-4 bg-primary text-on-primary rounded-2xl shadow-xl hover:opacity-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              <div>
                <span className="font-bold text-sm block">
                  {formatPieces(totalCartPieces)} in cart
                </span>
                <span className="text-xs text-on-primary/80">Tap to review & submit</span>
              </div>
            </div>
            <span className="font-bold text-base">{formatCurrency(totalCartAmount)}</span>
          </Link>
        </div>
      )}

      {/* Size Matrix Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-6 border border-outline-variant/30 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-primary font-bold uppercase">
                  {selectedProduct.brand}
                </span>
                <h3 className="font-bold text-base text-on-surface">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Colorways */}
            <div>
              <span className="text-xs font-semibold text-on-surface-variant block mb-2">
                Colorway: {activeColorway}
              </span>
              <div className="flex items-center gap-2">
                {selectedProduct.colorways.map((cw) => (
                  <button
                    key={cw.name}
                    onClick={() => setActiveColorway(cw.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                      activeColorway === cw.name
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface-container text-on-surface border-outline-variant/30"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ backgroundColor: cw.hex }}
                    />
                    <span>{cw.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApplyPreset("standard24")}
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-xs font-semibold rounded-lg text-on-surface"
              >
                Pack 24 (Ratio)
              </button>
              <button
                onClick={() => handleApplyPreset("clear")}
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-xs font-semibold rounded-lg text-on-surface-variant"
              >
                Clear
              </button>
            </div>

            {/* Variants in active color */}
            <div className="divide-y divide-surface-container/60 max-h-60 overflow-y-auto">
              {selectedProduct.variants
                .filter((v) => v.color.toLowerCase() === activeColorway.toLowerCase())
                .map((v) => {
                  const qty = matrixQtys[v.id] || 0;
                  return (
                    <div key={v.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-sm text-on-surface">{v.size}</span>
                        <span className="text-xs text-on-surface-variant block">
                          Available: {v.availableStock} pcs
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-outline-variant/30 bg-surface-container-low p-1">
                        <button
                          onClick={() => handleStepQty(v.id, -2)}
                          className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-surface-container"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold">{qty}</span>
                        <button
                          onClick={() => handleStepQty(v.id, 2)}
                          className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-surface-container"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCommitMatrixToCart}
                className="px-5 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow-sm hover:opacity-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

