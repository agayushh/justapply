import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://justapply.dev"),
  title: {
    default: "JustApply — Software Careers Directory",
    template: "%s | JustApply",
  },
  description:
    "Discover software engineering jobs at 100+ real tech companies worldwide. Browse careers at top startups, MNCs, SaaS, Fintech, AI, and DevTools companies in India, US, Europe and remote.",
  keywords: [
    "software engineering jobs",
    "tech careers",
    "developer jobs",
    "startup jobs",
    "remote software jobs",
    "India tech jobs",
    "fintech careers",
    "AI company jobs",
  ],
  authors: [{ name: "JustApply" }],
  creator: "JustApply",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://justapply.dev",
    siteName: "JustApply",
    title: "JustApply — Software Careers Directory",
    description:
      "Browse software developer careers at 100+ real companies — startups, MNCs, SaaS, Fintech, AI & more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JustApply — Software Careers Directory",
    description:
      "Browse software developer careers at 100+ real companies worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
