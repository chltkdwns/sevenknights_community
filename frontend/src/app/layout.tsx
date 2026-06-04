import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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
  title: "Seven Knights Community",
  description: "세븐나이츠 커뮤니티 — 공략·자유 게시판",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <Header />
          <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8 sm:px-6">
            <Sidebar />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
