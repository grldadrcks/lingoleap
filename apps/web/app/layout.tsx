import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LingoLeap — Free Language Learning",
  description: "Learn Spanish, Mandarin, and French for free. Build daily streaks and track your progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
