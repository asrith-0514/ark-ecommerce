"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreNav from "@/components/StoreNav";
import { useAppStore } from "@/lib/store-context";
import { formatCurrency, formatPieces, formatItems } from "@/lib/formatters";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    activeRetailer,
    products,
    updateCartQty,
    removeFromCart,
    submitStoreOrder,
    showToast,
  } = useAppStore();

  const [orderNote, setOrderNote] = useState("Please pack securely");
  const [submitting, setSubmitting] = useState(false);

  // Group cart items by productId
  const groupedCart = products
    .map((prod) => {
      const items = cart.filter((c) => c.productId === prod.id);
      return {
        product: prod,
        items,
      };
    })
    .filter((g) => g.items.length > 0);

  const totalPieces = cart.reduce((acc, it) => acc + it.qty, 0);
  const totalAmount = cart.reduce((acc, it) => acc + it.qty * it.unitPrice, 0);
  const totalItemsCount = groupedCart.length;

  const shortages = cart.filter((c) => {
    const prod = products.find((p) => p.id === c.productId);
    const variant = prod?.variants.find((v) => v.id === c.variantId);
    if (!variant) return false;
    return c.qty > variant.availableStock;
  });

  const hasShortages = shortages.length > 0;

  const handleSubmitOrder = () => {
    if (hasShortages) {
      showToast("Please adjust item quantities that exceed available stock.");
      return;
    }
    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newOrderNo = submitStoreOrder(orderNote);
      setSubmitting(false);
      router.push(`/orders/success?orderNo=${newOrderNo}`);
    }, 500);
  };

  return (
    <div className="bg-[#fcf8ff] min-h-screen text-on-surface antialiased flex flex-col pb-36">
      <StoreNav />

      <main className="flex-1 flex flex-col relative w-full pt-20 max-w-2xl mx-auto px-4 md:px-6 gap-4">
        {/* Retailer Context Banner */}
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[16px] text-primary">store</span>
            <span>{activeRetailer.name}</span>
          </div>
          <span className="font-mono text-outline">{activeRetailer.gstNumber}</span>
        </div>

        {/* Top Summary Card */}
        <div className="bg-surface-container-lowest rounded-[20px] p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            </div>
            <div>
              <span className="text-sm font-bold text-on-surface block leading-tight">
                {formatItems(totalItemsCount)} • {formatPieces(totalPieces)}
              </span>
              <span className="text-xs text-outline">Category {activeRetailer.category} Account</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-on-surface leading-tight block">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-xs text-on-surface-variant">Estimated total</span>
          </div>
        </div>

        {/* Shortages Alert */}
        {hasShortages && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-amber-950 text-xs">
            <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5">
              warning
            </span>
            <div className="flex-1">
              <h4 className="font-bold uppercase tracking-wider text-amber-900">
                Quantity Exceeds Available Stock
              </h4>
              <p className="mt-0.5 text-amber-800">
                Some items exceed current available inventory. Please decrease quantities before
                submitting.
              </p>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        {cart.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-8 text-center border border-outline-variant/30 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-outline text-[40px]">
              production_quantity_limits
            </span>
            <h3 className="font-bold text-base text-on-surface">Your Cart is Empty</h3>
            <p className="text-xs text-on-surface-variant max-w-xs">
              Explore the wholesale catalog to add products and select size packs.
            </p>
            <Link
              href="/shop"
              className="mt-2 px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl"
            >
              Start Ordering
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {groupedCart.map(({ product, items }) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase">
                      {product.brand}
                    </span>
                    <h3 className="font-bold text-sm text-on-surface">{product.title}</h3>
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant">{product.skuCode}</span>
                </div>

                <div className="divide-y divide-surface-container/60">
                  {items.map((item) => {
                    const variant = product.variants.find((v) => v.id === item.variantId);
                    const isOver = variant ? item.qty > variant.availableStock : false;

                    return (
                      <div
                        key={item.variantId}
                        className={`py-3 flex items-center justify-between text-xs ${
                          isOver ? "bg-amber-50/50 p-2 rounded-lg" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <div>
                            <span className="font-bold text-on-surface">
                              {item.size} • {item.color}
                            </span>
                            <span className="block text-xs text-on-surface-variant">
                              {formatCurrency(item.unitPrice)} each
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-lg border border-outline-variant/30 bg-surface-container-low p-0.5">
                            <button
                              onClick={() => updateCartQty(item.variantId, item.qty - 1)}
                              className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-surface-container"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold">{item.qty}</span>
                            <button
                              onClick={() => updateCartQty(item.variantId, item.qty + 1)}
                              className="w-6 h-6 rounded flex items-center justify-center font-bold hover:bg-surface-container"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-on-surface w-16 text-right">
                            {formatCurrency(item.qty * item.unitPrice)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.variantId)}
                            className="text-outline hover:text-error ml-1"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Note text area */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 shadow-sm flex flex-col gap-2 text-xs">
              <label className="font-semibold text-on-surface">Order Note</label>
              <textarea
                rows={2}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="Optional packing instructions..."
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface outline-none"
              />
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant/30 p-4 shadow-lg">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-on-surface-variant block">Total to Pay</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <button
              onClick={handleSubmitOrder}
              disabled={submitting || hasShortages}
              className={`px-8 py-3 rounded-full text-xs font-bold text-on-primary shadow-md transition-all ${
                hasShortages
                  ? "bg-outline cursor-not-allowed"
                  : "bg-primary hover:opacity-95 active:scale-95"
              }`}
            >
              {submitting ? "Submitting..." : `Submit Order (${totalPieces} pcs)`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

