"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LAPTOP_LOGO_SVG } from "@/lib/assets";
import { REPO, WA_GROUP } from "@/lib/data";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isCoursesActive = pathname === "/courses" || pathname.startsWith("/course/");

  return (
    <nav className="nav">
      <div className="nav-in">
        <Link className="nav-brand" href="/">
          <img
            className="nav-logo"
            src={LAPTOP_LOGO_SVG}
            alt="Coding laptop logo"
            width={30}
            height={30}
          />
          Python AI Engineering Journey
        </Link>
        <div className="nav-links" id="navLinks">
          <Link href="/" className={pathname === "/" ? "on" : ""}>
            Home
          </Link>
          <Link href="/courses" className={isCoursesActive ? "on" : ""}>
            Courses
          </Link>
          <Link href="/story" className={pathname === "/story" ? "on" : ""}>
            My Story
          </Link>
          <Link href="/contribute" className={pathname === "/contribute" ? "on" : ""}>
            Contribute
          </Link>
        </div>
        <div className="nav-sp"></div>
        <a
          className="btn btn-green btn-sm nav-start"
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
        >
          &#11088; Start Repo
        </a>
        <button
          className="nav-menu-btn"
          id="navMenuBtn"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="navDrop"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          &#9776; Menu
        </button>
      </div>

      <div className={`nav-drop ${menuOpen ? "open" : ""}`} id="navDrop">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/courses" onClick={() => setMenuOpen(false)}>
          Courses
        </Link>
        <Link href="/story" onClick={() => setMenuOpen(false)}>
          My Story
        </Link>
        <Link href="/contribute" onClick={() => setMenuOpen(false)}>
          Contribute
        </Link>
        <a
          className="drop-start"
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          &#11088; Start Repo
        </a>
        <a
          className="drop-wa"
          href={WA_GROUP}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Join WhatsApp Group
        </a>
      </div>
    </nav>
  );
}
