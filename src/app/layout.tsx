import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/query-provider";
import NextTopLoader from "nextjs-toploader";

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
            <NextTopLoader
              color="#29D"
              height={2}
              showSpinner={false}
              easing="ease"
              speed={200}
            />
            {children}
            <Toaster />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
