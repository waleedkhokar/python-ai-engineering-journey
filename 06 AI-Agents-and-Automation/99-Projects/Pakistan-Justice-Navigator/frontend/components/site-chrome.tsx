"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { TopNav } from "./top-nav";

type NavItem = { href: string; label: string; icon: IconName };

const WORKSPACE: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/case/new", label: "New Query", icon: "message" },
  { href: "/briefs", label: "Case Brief", icon: "brief" },
  { href: "/research", label: "Legal Research", icon: "search" },
  { href: "/drafting", label: "Draft Documents", icon: "edit" },
  { href: "/sources", label: "Source Library", icon: "library" },
  { href: "/saved", label: "Saved Work", icon: "bookmark" }
];

const EXPLORE: NavItem[] = [
  { href: "/map", label: "Courts & Regions", icon: "map" },
  { href: "/learn", label: "Legal Awareness", icon: "help" },
  { href: "/settings", label: "Settings", icon: "settings" }
];

const APP_PREFIXES = ["/dashboard", "/research", "/sources", "/case", "/briefs", "/drafting", "/saved", "/map", "/learn", "/settings"];

function isAppRoute(pathname: string) {
  return APP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isActive(pathname: string, href: string) {
  if (href === "/case/new") return pathname === "/case/new";
  if (href === "/briefs") return pathname === "/briefs" || (pathname.startsWith("/case/") && pathname !== "/case/new");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavGroup({ title, items, pathname }: { title: string; items: NavItem[]; pathname: string }) {
  return (
    <div className="side-group">
      <span className="side-group-title">{title}</span>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="side-link" aria-current={isActive(pathname, item.href) ? "page" : undefined}>
          <Icon name={item.icon} size={18} />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function SiteChrome({ footer, children }: { footer: ReactNode; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!isAppRoute(pathname)) {
    return (
      <>
        <TopNav />
        <main>{children}</main>
        {footer}
      </>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-mobilebar">
        <button type="button" className="app-menu-btn" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="app-sidebar" onClick={() => setOpen((value) => !value)}>
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
        <Link href="/" className="app-brand-mini"><Icon name="scale" size={18} /> Pakistan Justice Navigator</Link>
      </header>

      {open && <button type="button" className="app-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}

      <aside id="app-sidebar" className={open ? "app-sidebar is-open" : "app-sidebar"}>
        <Link href="/" className="side-brand" aria-label="Pakistan Justice Navigator home">
          <span className="side-brand-mark"><Icon name="scale" size={22} /></span>
          <span><strong>PAKISTAN JUSTICE</strong><small>NAVIGATOR</small></span>
        </Link>
        <nav aria-label="Dashboard navigation" className="side-nav">
          <NavGroup title="Workspace" items={WORKSPACE} pathname={pathname} />
          <NavGroup title="Explore" items={EXPLORE} pathname={pathname} />
        </nav>
        <div className="side-foot">
          <div className="side-note">
            <Icon name="shield" size={16} />
            <p>Informational support only — not legal advice. Verify important matters with a qualified lawyer or official source.</p>
          </div>
          <Link href="/" className="side-home">← Back to home</Link>
        </div>
      </aside>

      <main className="app-content">{children}</main>
    </div>
  );
}
