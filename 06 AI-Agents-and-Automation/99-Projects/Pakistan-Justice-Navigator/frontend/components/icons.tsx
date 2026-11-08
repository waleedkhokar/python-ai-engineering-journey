import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "scale"
  | "arrow"
  | "shield"
  | "document"
  | "message"
  | "upload"
  | "search"
  | "check"
  | "clock"
  | "book"
  | "plus"
  | "external"
  | "dashboard"
  | "brief"
  | "edit"
  | "library"
  | "bookmark"
  | "map"
  | "help"
  | "settings"
  | "menu"
  | "close";

export function Icon({
  name,
  size = 20,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true
  };

  const paths: Record<IconName, ReactNode> = {
    scale: (
      <>
        <path d="M12 3v18M5 6h14M7.5 6 4 13h7L7.5 6ZM16.5 6 13 13h7l-3.5-7ZM8 21h8" />
        <path d="M4 13c.4 2 1.6 3 3.5 3S10.6 15 11 13M13 13c.4 2 1.6 3 3.5 3S19.6 15 20 13" />
      </>
    ),
    arrow: <path d="M5 12h13M14 7l5 5-5 5" />,
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.8 2.8 8.4 7 10 4.2-1.6 7-5.2 7-10V6l-7-3Z" />
        <path d="m9.3 12 1.8 1.8 3.8-4" />
      </>
    ),
    document: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v5h5M10 12h5M10 16h5" />
      </>
    ),
    message: (
      <>
        <path d="M4 5h16v11H9l-5 4V5Z" />
        <path d="M8 9h8M8 12h6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V5M8 9l4-4 4 4" />
        <path d="M5 14v5h14v-5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />
        <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    external: (
      <>
        <path d="M14 5h5v5M13 11l6-6" />
        <path d="M18 13v6H5V6h6" />
      </>
    ),
    dashboard: (
      <>
        <rect x="4" y="4" width="7" height="8" rx="1.5" />
        <rect x="13" y="4" width="7" height="5" rx="1.5" />
        <rect x="13" y="11" width="7" height="9" rx="1.5" />
        <rect x="4" y="14" width="7" height="6" rx="1.5" />
      </>
    ),
    brief: (
      <>
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M9 7V5h6v2M4 12h16" />
      </>
    ),
    edit: (
      <>
        <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
        <path d="m13.5 6.5 4 4" />
      </>
    ),
    library: (
      <>
        <path d="M5 4v16M9 4v16M13 6l4 14M19 5l-3 .8" />
      </>
    ),
    bookmark: <path d="M7 4h10v16l-5-3.5L7 20V4Z" />,
    map: (
      <>
        <path d="m9 5-5 2v12l5-2 6 2 5-2V5l-5 2-6-2Z" />
        <path d="M9 5v12M15 7v12" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.6 9.5a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2.9-1.2 1.8M12 16.6v.1" />
      </>
    ),
    settings: (
      <>
        <path d="M5 7h9M18 7h1M5 17h1M10 17h9" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />
  };

  return (
    <svg {...common} {...props}>
      {paths[name]}
    </svg>
  );
}
