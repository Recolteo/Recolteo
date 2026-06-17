import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import CookieManager from "../components/ui/cookie/CookieManager";
import { createClient } from "@/src/lib/supabase/server";
import { getUserProfile } from "@/src/lib/user-profile";
import { CartProvider } from "@/src/lib/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Récoltéo",
  description:
    "Connecte commerçants et associations pour une solidarité simple et rapide.",
};

async function HeaderWithAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <Header />;

  const { data: adminRow } = await supabase
    .from("administrateur")
    .select("nom, prenom")
    .maybeSingle();

  if (adminRow) {
    return (
      <Header
        user={{ nom: `${adminRow.prenom} ${adminRow.nom}`, role: "admin" }}
      />
    );
  }

  const profile = await getUserProfile(user.id);
  if (!profile) return <Header />;

  return <Header user={{ nom: profile.nom, role: profile.role }} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <CartProvider>
          <Suspense fallback={<Header />}>
            <HeaderWithAuth />
          </Suspense>
          {children}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
          <CookieManager />
        </CartProvider>
      </body>
    </html>
  );
}
