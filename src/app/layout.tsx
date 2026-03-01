import type { Metadata } from "next";
import { Noto_Sans_KR, Outfit } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Hyperdash",
  description: "Cryptocurrency Trading Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${outfit.className} ${notoSansKr.variable} antialiased bg-black text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
