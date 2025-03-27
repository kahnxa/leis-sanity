import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Leis",
  description: "Website for all things Leis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <main>
            <Header />
            {children}
            <Footer />
          </main>
          <SanityLive />
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
