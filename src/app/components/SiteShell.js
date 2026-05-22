"use client";

import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("./SpaceBackground"), {
  ssr: false,
});

export default function SiteShell({ children }) {
  return (
    <>
      <SpaceBackground />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
