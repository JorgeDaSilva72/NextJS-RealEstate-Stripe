import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import Appbar from "./components/Appbar";
import SignInPanel from "./components/signInPanel";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KRIST IMMO",
  description: "Site d'annonces immobilières au Cameroun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Appbar>
            <SignInPanel />
          </Appbar>
          {children}
        </Providers>
      </body>
    </html>
  );
}
