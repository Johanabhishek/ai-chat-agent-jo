import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import React from "react"; // <-- Fixed import; was 'react'

=======
import React from "react";
>>>>>>> f93de92fc6aa47afa3d58adaae6c8c296f25bbce
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Agent Task",
  description: "Minimal Claude/Perplexity-inspired chat app, Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
