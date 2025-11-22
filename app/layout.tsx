import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ← これがあるか確認！

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "見積追客くん",
  description: "塗装・リフォーム特化型 成約支援SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}