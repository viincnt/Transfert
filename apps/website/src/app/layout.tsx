import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "lenis/dist/lenis.css";
import "./globals.css";
import MotionRoot from "./components/motion-root";

const inter = localFont({
  src: "../../public/fonts/Inter-Variable.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Transfert — Your files. Your way.",
  description:
    "A free, local app to convert images, video, audio and documents, edit metadata and prepare files for sharing. In development.",
  icons: {
    icon: "/brand/Transfert.png",
    apple: "/brand/Transfert.png",
    shortcut: "/brand/Transfert.png",
  },
  openGraph: {
    title: "Transfert — Your files. Your way.",
    description:
      "File conversion and metadata control. Completely free. All on your device.",
    locale: "en_US",
    type: "website",
    images: [{ url: "/brand/Transfert.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary",
    title: "Transfert — Your files. Your way.",
    description:
      "File conversion and metadata control. Completely free. All on your device.",
    images: ["/brand/Transfert.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages();
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <MotionRoot />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
