"use client";

import AuthNav from "@/app/components/AuthNav";
import BasketNavButton from "@/app/components/BasketNavButton";

export default function StoreToolbar() {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <BasketNavButton />
      <AuthNav />
    </div>
  );
}
