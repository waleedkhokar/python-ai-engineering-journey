import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
import "./app-shell.css";
import { SiteChrome } from "@/components/site-chrome";
import { Icon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Pakistan Justice Navigator",
  description: "AI-assisted case preparation grounded in Pakistani official legal sources."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome footer={<footer className="footer footer-v3 landing-footer">
          <div className="footer-brand-block">
            <div className="footer-brand"><span><Icon name="scale" size={24} /></span><strong>LEGAL<br />AGENT</strong></div>
            <p>AI-powered legal understanding and preparation for Pakistani legal contexts.</p>
            <Link href="/case/new" className="footer-cta">Start Your Case <Icon name="arrow" size={16} /></Link>
          </div>
          <div className="footer-links"><div><strong>Explore</strong><Link href="/#about">About</Link><Link href="/#capabilities">Capabilities</Link><Link href="/#story">How it works</Link><Link href="/#pakistani-law">Pakistani law</Link></div><div><strong>Product</strong><Link href="/case/new">Legal Agent</Link><Link href="/research">Legal research</Link><Link href="/case/new">Start a case</Link></div><div><strong>Information</strong><Link href="/login">Sign in</Link><Link href="/sources">Sources</Link><Link href="/#responsible-ai">Responsible AI</Link></div></div>
          <div className="footer-visual"><img src="/references/fist-scales.webp" alt="" /></div>
          <div className="footer-legal"><span>© 2026 Legal Agent.</span><p>Legal Agent provides informational and preparation assistance and is not a substitute for professional legal representation.</p></div>
        </footer>}>{children}</SiteChrome>
      </body>
    </html>
  );
}
