import "./globals.css";
import type { ReactNode } from "react";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <main className="mx-auto min-h-screen max-w-5xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
