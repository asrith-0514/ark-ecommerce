"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-primary text-sm font-semibold">
        <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
        <span>Opening Dashboard...</span>
      </div>
    </div>
  );
}

