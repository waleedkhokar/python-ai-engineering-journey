"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icons";

export function TopNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  const links = [
    ["/#about", "About"],
    ["/#capabilities", "Capabilities"],
    ["/#story", "How it works"],
    ["/#pakistani-law", "Pakistani law"]
  ] as const;

  return (
    <header className={`topbar ${onHome ? "topbar-cinematic" : ""}`}>
      <Link href="/" className="brand" aria-label="Pakistan Justice Navigator home" onClick={() => setOpen(false)}>
        <span className="brand-mark"><Icon name="scale" size={20} /></span>
        <span>
          <strong>PAKISTAN JUSTICE</strong>
          <small>NAVIGATOR</small>
        </span>
      </Link>

      <button className="menu-button" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
        <span /> <span /> <span />
      </button>

      <nav className={open ? "navlinks nav-open" : "navlinks"} aria-label="Primary navigation">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className={pathname === href ? "nav-active" : ""} onClick={() => setOpen(false)}>{label}</Link>
        ))}
        <Link href="/login" className="nav-login" onClick={() => setOpen(false)}>Sign in</Link>
        <Link href="/case/new" className="nav-cta" onClick={() => setOpen(false)}>
          Start a case <Icon name="arrow" size={17} />
        </Link>
      </nav>
    </header>
  );
}
