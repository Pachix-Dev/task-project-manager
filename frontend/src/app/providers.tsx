"use client";

import type { ReactNode } from "react";
import { Toaster } from "sileo";
import "sileo/styles.css";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-center" theme="light" />
    </>
  );
}
