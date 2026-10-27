import React from "react";

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  switch (name) {
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <polyline points="8 6 3 12 8 18" />
          <polyline points="16 6 21 12 16 18" />
          <line x1="13.5" y1="4" x2="10.5" y2="20" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <line x1="4" y1="20" x2="20" y2="20" />
          <rect x="5" y="11" width="3.4" height="9" rx="0.6" />
          <rect x="10.3" y="6" width="3.4" height="14" rx="0.6" />
          <rect x="15.6" y="9" width="3.4" height="11" rx="0.6" />
        </svg>
      );
    case "cpu":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <rect x="10" y="10" width="4" height="4" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </svg>
      );
    case "network":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="5" r="2.4" />
          <circle cx="5" cy="19" r="2.4" />
          <circle cx="19" cy="19" r="2.4" />
          <path d="M12 7.4 6.2 16.8M12 7.4l5.8 9.4M7.4 19h9.2" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" />
          <path d="M19 15.5l.8 2.2 2.2.8-2.2.8L19 21.5l-.8-2.2-2.2-.8 2.2-.8L19 15.5Z" />
        </svg>
      );
    case "bot":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="4" y="8" width="16" height="11" rx="2.5" />
          <path d="M12 8V4.5" />
          <circle cx="12" cy="3.4" r="1.1" />
          <circle cx="9" cy="13" r="0.6" fill="currentColor" />
          <circle cx="15" cy="13" r="0.6" fill="currentColor" />
          <path d="M9.5 16.2h5" />
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9.2" />
          <polygon points="15.5 8.5 13.6 13.6 8.5 15.5 10.4 10.4" />
        </svg>
      );
    case "tree":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="6" cy="5.5" r="2.3" />
          <circle cx="6" cy="18.5" r="2.3" />
          <circle cx="18" cy="12" r="2.3" />
          <path d="M8 6.5 15.8 11M8 17.5 15.8 13" />
        </svg>
      );
    case "cloud":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M17.5 18.5a4.6 4.6 0 0 0 .9-9.1 6.4 6.4 0 0 0-12.3 1.6A4.2 4.2 0 0 0 7 18.5h10.5Z" />
          <path d="M12 12v7M9.8 16.8 12 19l2.2-2.2" />
        </svg>
      );
    case "db":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <ellipse cx="12" cy="5.4" rx="7.6" ry="2.9" />
          <path d="M4.4 5.4v13.2c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V5.4" />
          <path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9" />
        </svg>
      );
    case "ext":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      );
    case "arrow":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4.5 12.5 10 18 19.5 6.5" />
        </svg>
      );
    case "folder":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.4h9A1.5 1.5 0 0 1 21 9.9v7.6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-10Z" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
        </svg>
      );
    case "target":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="9" cy="8" r="3.4" />
          <path d="M3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
          <path d="M16 5.2a3.4 3.4 0 0 1 0 6.1M17.8 15.3c1.5.7 2.4 2.2 2.7 4.7" />
        </svg>
      );
    case "briefcase":
    case "portfolio":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
          <path d="M9 7.5V6a2.5 2.5 0 0 1 2.5-2.5h1A2.5 2.5 0 0 1 15 6v1.5M3 12.5h18" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.5 2.9c0 3.7-3.5 6.9-8.5 10.9Z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.2 2" />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m12 3 9.5 5L12 13 2.5 8 12 3Z" />
          <path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 17l8.5 4.7L20.5 17" />
        </svg>
      );
    default:
      return null;
  }
}
