import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Mehrim — sizdan unga, bitta havola bilan",
  description:
    "Sevganlaringizga maxsus tabriklar va sovg'alar yuboring. Mehrim orqali masofalar yaqinlashadi, qalblar birlashadi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={`${display.variable} ${body.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
