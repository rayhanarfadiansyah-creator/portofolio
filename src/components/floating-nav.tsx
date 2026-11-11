
"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const expanded = !scrolled || hovered || mobileOpen;

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="floating-nav-wrap">
      <div
        className={`floating-nav ${expanded ? "is-expanded" : "is-collapsed"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setHovered(false);
          }
        }}
      >
        <a
          href="/login"
          className="floating-brand"
          aria-label="R Studio — Admin login"
          title="R Studio"
        >
          R Studio<span>.</span>
        </a>

        <nav className="floating-links" aria-label="Main navigation">
          <a href="#about" onClick={closeMobileMenu}>About</a>
          <a href="#journey" onClick={closeMobileMenu}>Journey</a>
          <a href="#projects" onClick={closeMobileMenu}>Projects</a>
          <a href="#contact" onClick={closeMobileMenu}>Contact</a>
        </nav>

        <a
          href="#contact"
          className="floating-cta"
          onClick={closeMobileMenu}
        >
          Let’s talk <ArrowUpRight size={15} />
        </a>

        <button
          type="button"
          className="floating-menu-toggle"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
    </header>
  );
}
