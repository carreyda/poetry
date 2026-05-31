import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "古韵诗词",
    template: "%s · 古韵诗词",
  },
  description: "一个用于收集、录入与展示诗词歌赋的典雅现代网站。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
