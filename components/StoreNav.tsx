"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store-context";

export default function StoreNav() {
  const pathname = usePathname();
  const { cart, activeRetailer, currentUser } = useAppStore();

  const totalCartQty = cart.reduce((acc, it) => acc + it.qty, 0);

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(20,20,43,0.04)] border-b border-surface-container/60">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <Link href="/shop" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_2px_8px_rgba(65,63,214,0.25)]">
                <span className="material-symbols-outlined text-on-primary text-[20px]">hub</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-base text-on-surface leading-tight">
                  ARK Connect
                </span>
                <span className="text-xs text-primary font-semibold">
                  Retailer Ordering
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Icon with badge */}
            <Link
              href="/cart"
              className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors"
              aria-label="Cart"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {totalCartQty > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-primary text-on-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {totalCartQty}
                </span>
              )}
            </Link>

            {/* Retailer Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-sm">
                R1
              </div>
              <span className="hidden sm:inline text-xs font-bold text-on-surface">
                {activeRetailer.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(20,20,43,0.05)] border-t border-surface-container/60">
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto text-xs">
          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 rounded-full transition-all px-2 ${
              pathname === "/shop"
                ? "text-primary bg-primary-fixed/50 font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">storefront</span>
            <span className="text-xs mt-0.5">Shop</span>
          </Link>

          <Link
            href="/orders"
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 rounded-full transition-all px-2 ${
              pathname.startsWith("/orders")
                ? "text-primary bg-primary-fixed/50 font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            <span className="text-xs mt-0.5">Orders</span>
          </Link>

          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center min-w-[64px] h-12 rounded-full transition-all px-2 ${
              pathname === "/cart"
                ? "text-primary bg-primary-fixed/50 font-bold"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            <span className="text-xs mt-0.5">Cart</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
