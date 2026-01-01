import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/query-provider";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Quiz Engine",
  description: "An AI-powered Q&A platform to get answers to your questions.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body>
          <QueryProvider>
            <Navbar />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
