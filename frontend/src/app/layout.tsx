import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
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
  // 브라우저 탭 제목 (사이트 표시명과 동일하게 유지)
  title: "세나 젤리",
  description: "세븐나이츠 커뮤니티 — 공략·자유 게시판",
  // 탭 아이콘은 app/icon.png 파일 컨벤션으로 적용. 여기에 icons를 또 넣지 않는다.
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
          <AppShell>{children}</AppShell>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
