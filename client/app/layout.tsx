import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { getCurrentUser } from "@/lib/auth-server";
import Header from "@/components/Header";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ticketing",
  description: "Buy and sell tickets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser(await headers());
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider initialUser={currentUser}>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
