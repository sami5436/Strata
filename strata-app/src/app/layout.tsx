import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STRATA — Oil Trading Intelligence",
  description: "Real-time trading intelligence dashboard for oil & gas companies. What should you do with your oil TODAY to make the most money?",
  keywords: ["oil trading", "crude oil", "arbitrage", "trading intelligence", "commodity trading"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
