import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shault.edycu.dev"),
  title: "Shault | Privacy Payment Vault",
  description: "Privacy-first payment vault powered by KiraPay.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Shault | Privacy Payment Vault",
    description: "Privacy-first payment vault powered by KiraPay.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shault | Privacy Payment Vault",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shault | Privacy Payment Vault",
    description: "Privacy-first payment vault powered by KiraPay.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-950 text-slate-50 min-h-screen selection:bg-purple-500/30`}
      >
        {children}
      </body>
    </html>
  );
}
