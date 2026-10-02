import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NET CORP",
    template: "%s | NET CORP",
  },
  description: "NET CORP Internal Enrollment Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={geist.className}>
        {children}

        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
