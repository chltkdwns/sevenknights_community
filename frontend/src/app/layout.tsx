import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileNavProvider } from "@/components/layout/MobileNavProvider";
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
      <body className="flex min-h-full flex-col overflow-x-hidden bg-background text-foreground antialiased">
        <ThemeProvider>
          <MobileNavProvider>
            <Header />
            <AppShell>{children}</AppShell>
            <Footer />
          </MobileNavProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
