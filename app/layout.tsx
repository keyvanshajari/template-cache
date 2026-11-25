import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Catalog",
    template: "%s · Catalog",
  },
  description: "Sample product catalog cached with Cache Components",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-950 dark:bg-black dark:text-zinc-50">
        <header className="border-b border-black/10 dark:border-white/10">
          <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              Catalog
            </Link>
            <div className="flex items-center gap-5 text-sm">
              <Link href="/products" prefetch={true}>
                Products
              </Link>
              <Link href="/ppr" prefetch={true}>
                PPR
              </Link>
              <Link href="/api/tags">Tags API</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
