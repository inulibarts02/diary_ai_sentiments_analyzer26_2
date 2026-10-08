import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diary AI Sentiments Analyzer",
  description: "오늘 하루의 생각과 감정을 편안하게 적어보세요. Gemini AI가 따뜻한 공감과 심층 분석을 전해드립니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#fef7ff] text-[#1d1a22]">
        {children}
      </body>
    </html>
  );
}
