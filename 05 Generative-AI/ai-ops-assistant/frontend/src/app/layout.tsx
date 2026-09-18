import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-Ops Assistant",
  description: "Enterprise AI-Ops Assistant Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}