import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { GlobalProvider } from "@/context/GlobalContext";
import { Toaster } from "react-hot-toast";
import { toasterConfig } from "@/utils/toasterConfig";
import { GlobalLoading } from "@/components/ui/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pinklyn | Tu Marketplace de Confianza",
  description: "Plataforma de compra y venta de productos exclusivos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProvider>
          <AuthProvider>
            <GlobalLoading />
            {children}
          </AuthProvider>
        </GlobalProvider>
        <Toaster {...toasterConfig} />
      </body>
    </html>
  );
}
