import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX GTM — Agentic Revenue Intelligence",
  description: "AI agents that prospect, personalize, and close. Autonomous GTM for modern revenue teams.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "APEX GTM",
    description: "Agentic AI for sales, GTM strategy, and marketing automation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-apex-black text-apex-text-primary`}
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#161D2F",
              color: "#F1F5F9",
              border: "1px solid #1E2D40",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "#080B12" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#080B12" },
            },
          }}
        />
      </body>
    </html>
  );
}
