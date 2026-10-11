import "./global.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { appName, siteUrl } from "@/lib/shared";

// Same typeface as the desktop app (@fontsource-variable/geist), so the
// product and the site read as one thing.
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: appName,
    template: `%s - ${appName}`,
  },
  description: "A private, local-first toolbox for your files.",
  applicationName: appName,
  keywords: [
    "local-first",
    "file converter",
    "image converter",
    "metadata remover",
    "private file tools",
    "offline file tools",
  ],
  authors: [{ name: "Vincent", url: "https://viincnt.com" }],
  creator: "Vincent",
  publisher: appName,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: appName,
    title: "Transfert - Your files stay with you.",
    description: "A private, local-first toolbox for your files.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transfert - Your files stay with you.",
    description: "A private, local-first toolbox for your files.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `try { const theme = localStorage.getItem("transfert-site-theme"); if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme; } catch {}`,
          }}
        />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: appName,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Windows",
              description: "A private, local-first toolbox for your files.",
              url: siteUrl.href,
              sameAs: ["https://github.com/viincnt/Transfert"],
              author: {
                "@type": "Person",
                name: "Vincent",
                url: "https://viincnt.com",
              },
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </body>
    </html>
  );
}
