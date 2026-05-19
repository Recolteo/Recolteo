import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { createClient } from "@/src/lib/supabase/server";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userInfo: { nom: string; role: "commercant" | "association" | "admin" } | undefined;

  if (user) {
    const [{ data: adminRow }, { data: commercant }, { data: association }, { data: userRow }] =
      await Promise.all([
        supabase.from("administrateur").select("nom, prenom").maybeSingle(),
        supabase.from("commercant").select("name_entreprise").maybeSingle(),
        supabase.from("association").select("name_entreprise").maybeSingle(),
        supabase.from("user").select("nom").maybeSingle(),
      ]);

    if (adminRow) {
      userInfo = { nom: `${adminRow.prenom} ${adminRow.nom}`, role: "admin" };
    } else if (commercant) {
      userInfo = { nom: userRow?.nom ?? commercant.name_entreprise, role: "commercant" };
    } else if (association) {
      userInfo = { nom: userRow?.nom ?? association.name_entreprise, role: "association" };
    }
  }

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cream">
        <Header user={userInfo} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
