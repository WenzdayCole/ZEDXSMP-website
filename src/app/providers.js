"use client";

import SiteShell from "@/app/components/SiteShell";
import CookieNotice from "@/app/components/CookieNotice";

export default function AppProviders({ children }) {
  return (
    <SiteShell>
      {children}
      <CookieNotice />
    </SiteShell>
  );
}
