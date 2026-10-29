"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Product,
  WholesaleOrder,
  Retailer,
  OrderStatus,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_RETAILERS,
  BRAND_SALES_REPORT,
  BrandSalesRow,
} from "./data";

export interface User {
  id: string;
  name: string;
  role: "staff" | "retailer";
  title: string;
  retailerId?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productTitle: string;
  brand: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  qty: number;
  unitPrice: number;
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: "staff" | "retailer") => void;
  products: Product[];
  orders: WholesaleOrder[];
  retailers: Retailer[];
  activeRetailer: Retailer;
  cart: CartItem[];
  updateOrderItemQty: (orderId: string, itemId: string, newQty: number) => void;
  confirmOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  dispatchOrder: (
    orderId: string,
    dispatchedQtyMap: Record<string, number>,
    transporter: string,
    lr: string,
    note?: string
  ) => void;
  addStock: (variantId: string, addedQty: number) => void;
  updateProductPrice: (
    productId: string,
    categoryKey: "priceA2" | "priceA1" | "priceA",
    newPrice: number
  ) => void;
  updateRetailerCategory: (retailerId: string, newCategory: "A++" | "A+" | "A") => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQty: (variantId: string, newQty: number) => void;
  clearCart: () => void;
  submitStoreOrder: (retailerNote?: string) => string;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Computed values
  stockHealth: {
    totalPhysical: number;
    totalReserved: number;
    totalAvailable: number;
    ratio: number; // available / physical
    outOfStockCount: number;
  };
  brandSalesData: BrandSalesRow[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: "USR-01",
    name: "Priya Sharma",
    role: "staff",
    title: "Operations",
  });

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<WholesaleOrder[]>(INITIAL_ORDERS);
  const [retailers, setRetailers] = useState<Retailer[]>(INITIAL_RETAILERS);
  const [activeRetailer] = useState<Retailer>(INITIAL_RETAILERS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([
    {
      productId: "PROD-01",
      variantId: "V-02",
      productTitle: "Ankle Fit Leggings",
      brand: "Flybirds",
      sku: "FB-LG-AF01",
      size: "M",
      color: "Black",
      colorHex: "#111111",
      qty: 12,
      unitPrice: 240,
    },
    {
      productId: "PROD-02",
      variantId: "V-09",
      productTitle: "Regular Fit Leggings",
      brand: "Flycute",
      sku: "FC-LG-RG04",
      size: "L",
      color: "Navy",
      colorHex: "#1b2b4f",
      qty: 10,
      unitPrice: 225,
    },
    {
      productId: "PROD-03",
      variantId: "V-12",
      productTitle: "Modal Slip Camisole",
      brand: "Exena",
      sku: "EX-IN-MS02",
      size: "M",
      color: "White",
      colorHex: "#ffffff",
      qty: 10,
      unitPrice: 180,
    },
  ]);

  const switchRole = (role: "staff" | "retailer") => {
    if (role === "staff") {
      setCurrentUser({
        id: "USR-01",
        name: "Priya Sharma",
        role: "staff",
        title: "Operations",
      });
    } else {
      setCurrentUser({
        id: "RET-01",
        name: "Rajesh Kumar",
        role: "retailer",
        title: "Retailer 01 - Siddipet",
        retailerId: "RET-01",
      });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const updateOrderItemQty = (orderId: string, itemId: string, newQty: number) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedItems = order.items.map((item) => {
          if (item.id !== itemId) return item;
          return { ...item, approvedQty: Math.max(0, newQty) };
        });
        const approvedPieces = updatedItems.reduce((acc, i) => acc + i.approvedQty, 0);
        return {
          ...order,
          items: updatedItems,
          approvedPieces,
        };
      })
    );
    showToast("Approved quantity updated");
  };

  const confirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: "Confirmed",
          timeline: order.timeline.map((t) =>
            t.stage === "Confirmed"
              ? { ...t, completed: true, timestamp: "Just now" }
              : t
          ),
        };
      })
    );
    showToast(`Order ${orderId} confirmed`);
  };

  const rejectOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: "Rejected",
        };
      })
    );
    showToast(`Order ${orderId} marked as rejected`);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: "Cancelled",
        };
      })
    );
    showToast(`Order ${orderId} cancelled`);
  };

  const dispatchOrder = (
    orderId: string,
    dispatchedQtyMap: Record<string, number>,
    transporter: string,
    lr: string,
    note?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        let totalNewDispatched = 0;
        const updatedItems = order.items.map((item) => {
          const addDispatched = dispatchedQtyMap[item.id] || 0;
          totalNewDispatched += addDispatched;
          return {
            ...item,
            dispatchedQty: item.dispatchedQty + addDispatched,
          };
        });

        const totalDispatched = order.dispatchedPieces + totalNewDispatched;
        const isFullyDispatched = totalDispatched >= order.approvedPieces;
        const newStatus: OrderStatus = isFullyDispatched ? "Dispatched" : "Partially Dispatched";

        return {
          ...order,
          status: newStatus,
          dispatchedPieces: totalDispatched,
          transporterName: transporter || order.transporterName,
          lrNumber: lr || order.lrNumber,
          dispatchNote: note || order.dispatchNote,
          timeline: order.timeline.map((t) => {
            if (t.stage === "Partially Dispatched" && !isFullyDispatched) {
              return { ...t, completed: true, timestamp: "Just now" };
            }
            if (t.stage === "Dispatched" && isFullyDispatched) {
              return { ...t, completed: true, timestamp: "Just now" };
            }
            return t;
          }),
        };
      })
    );

    // Also deduct physical stock and reserved stock for the dispatched items
    setProducts((prev) =>
      prev.map((product) => {
        const updatedVariants = product.variants.map((v) => {
          let dispatchedForThisVariant = 0;
          Object.entries(dispatchedQtyMap).forEach(([itemId, qty]) => {
            const order = orders.find((o) => o.id === orderId);
            const item = order?.items.find((i) => i.id === itemId);
            if (item && item.sku === v.sku) {
              dispatchedForThisVariant += qty;
            }
          });

          if (dispatchedForThisVariant > 0) {
            const newPhysical = Math.max(0, v.physicalStock - dispatchedForThisVariant);
            const newReserved = Math.max(0, v.reservedStock - dispatchedForThisVariant);
            const newAvailable = Math.max(0, newPhysical - newReserved);
            return {
              ...v,
              physicalStock: newPhysical,
              reservedStock: newReserved,
              availableStock: newAvailable,
              status: (newAvailable === 0
                ? "out_of_stock"
                : newAvailable < 15
                ? "low_stock"
                : "in_stock") as "out_of_stock" | "low_stock" | "in_stock",
            };
          }
          return v;
        });
        return { ...product, variants: updatedVariants };
      })
    );

    showToast(`Dispatch recorded for ${orderId}`);
  };

  const addStock = (variantId: string, addedQty: number) => {
    setProducts((prev) =>
      prev.map((product) => {
        const hasVariant = product.variants.some((v) => v.id === variantId);
        if (!hasVariant) return product;

        const updatedVariants = product.variants.map((v) => {
          if (v.id !== variantId) return v;
          const newPhysical = v.physicalStock + addedQty;
          const newAvailable = newPhysical - v.reservedStock;
          return {
            ...v,
            physicalStock: newPhysical,
            availableStock: newAvailable,
            status: (newAvailable === 0
              ? "out_of_stock"
              : newAvailable < 15
              ? "low_stock"
              : "in_stock") as "out_of_stock" | "low_stock" | "in_stock",
          };
        });
        return { ...product, variants: updatedVariants };
      })
    );
    showToast(`Inbound stock +${addedQty} pcs added`);
  };

  const updateProductPrice = (
    productId: string,
    categoryKey: "priceA2" | "priceA1" | "priceA",
    newPrice: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedVariants = prod.variants.map((v) => ({
          ...v,
          [categoryKey]: newPrice,
        }));
        return { ...prod, variants: updatedVariants };
      })
    );
    showToast("Price updated successfully");
  };

  const updateRetailerCategory = (retailerId: string, newCategory: "A++" | "A+" | "A") => {
    setRetailers((prev) =>
      prev.map((r) => (r.id === retailerId ? { ...r, category: newCategory } : r))
    );
    showToast("Retailer category updated");
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, item];
    });
    showToast(`Added ${item.qty} pcs of ${item.productTitle}`);
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((i) => i.variantId !== variantId));
    showToast("Item removed from cart");
  };

  const updateCartQty = (variantId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, qty: newQty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const submitStoreOrder = (retailerNote?: string) => {
    const nextOrderNum = 8831;
    const newOrderId = `ORD-${nextOrderNum}`;

    const orderItems: WholesaleOrder["items"] = cart.map((c, index) => ({
      id: `ITEM-NEW-${index + 1}`,
      productId: c.productId,
      productTitle: c.productTitle,
      sku: c.sku,
      brand: c.brand,
      variant: `${c.color} • ${c.size}`,
      color: c.color,
      colorHex: c.colorHex,
      size: c.size,
      orderedQty: c.qty,
      approvedQty: c.qty,
      dispatchedQty: 0,
      availableStock: 20,
      unitPrice: c.unitPrice,
    }));

    const totalPieces = cart.reduce((acc, i) => acc + i.qty, 0);
    const totalAmount = cart.reduce((acc, i) => acc + i.qty * i.unitPrice, 0);

    const newOrder: WholesaleOrder = {
      id: newOrderId,
      orderNo: newOrderId,
      retailerId: activeRetailer.id,
      retailerName: activeRetailer.name,
      region: activeRetailer.region,
      category: activeRetailer.category,
      status: "Submitted",
      createdAt: "Just now",
      retailerNote: retailerNote || "",
      totalPieces,
      approvedPieces: totalPieces,
      dispatchedPieces: 0,
      totalAmount,
      timeline: [
        { stage: "Submitted", timestamp: "Just now", completed: true },
        { stage: "Confirmed", completed: false },
        { stage: "Packing", completed: false },
        { stage: "Partially Dispatched", completed: false },
        { stage: "Dispatched", completed: false },
        { stage: "Delivered", completed: false },
      ],
      items: orderItems,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrderId;
  };

  // Compute stock health and metrics from actual product records
  const allVariants = products.flatMap((p) => p.variants);
  const totalPhysical = allVariants.reduce((sum, v) => sum + v.physicalStock, 0);
  const totalReserved = allVariants.reduce((sum, v) => sum + v.reservedStock, 0);
  const totalAvailable = allVariants.reduce((sum, v) => sum + v.availableStock, 0);
  const ratio = totalPhysical > 0 ? totalAvailable / totalPhysical : 0;
  const outOfStockCount = allVariants.filter((v) => v.availableStock === 0).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        products,
        orders,
        retailers,
        activeRetailer,
        cart,
        updateOrderItemQty,
        confirmOrder,
        rejectOrder,
        cancelOrder,
        dispatchOrder,
        addStock,
        updateProductPrice,
        updateRetailerCategory,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        submitStoreOrder,
        toastMessage,
        showToast,
        stockHealth: {
          totalPhysical,
          totalReserved,
          totalAvailable,
          ratio,
          outOfStockCount,
        },
        brandSalesData: BRAND_SALES_REPORT,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-2xl border border-outline-variant/30 text-sm font-medium">
          <span className="material-symbols-outlined text-primary text-[20px]">
            check_circle
          </span>
          {toastMessage}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
