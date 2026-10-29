import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store-context";
import { RoleGuard } from "@/components/RoleGuard";

export const metadata: Metadata = {
  title: "ARK Connect",
  description: "B2B wholesale platform and retailer order portal for apparel brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-surface">
        <AppProvider>
          <RoleGuard>{children}</RoleGuard>
        </AppProvider>
      </body>
    </html>
  );
}
