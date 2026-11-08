import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

export function PageHeader({ eyebrow, title, lede, action }: { eyebrow: string; title: string; lede?: string; action?: ReactNode }) {
  return (
    <header className="app-pagehead">
      <div>
        <span className="app-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lede && <p>{lede}</p>}
      </div>
      {action}
    </header>
  );
}

export function Notice({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "green" }) {
  return (
    <div className={`app-notice app-notice-${tone}`} role="note">
      <Icon name="shield" size={18} />
      <p>{children}</p>
    </div>
  );
}

export function EmptyState({ icon, title, body, href, cta }: { icon: IconName; title: string; body: string; href?: string; cta?: string }) {
  return (
    <div className="app-empty">
      <span><Icon name={icon} size={26} /></span>
      <h3>{title}</h3>
      <p>{body}</p>
      {href && cta && <Link href={href} className="app-btn app-btn-primary">{cta}</Link>}
    </div>
  );
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}
