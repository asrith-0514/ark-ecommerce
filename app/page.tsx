"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store-context";

export default function RootRedirectPage() {
  const router = useRouter();
  const { currentUser } = useAppStore();

  useEffect(() => {
    if (currentUser.role === "retailer") {
      router.replace("/shop");
    } else {
      router.replace("/admin/dashboard");
    }
  }, [currentUser.role, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-primary text-sm font-semibold">
        <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
        <span>Loading ARK Connect...</span>
      </div>
    </div>
  );
}
