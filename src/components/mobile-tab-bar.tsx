
"use client";

import { useEffect, useState } from "react";
import {
  House,
  UserRound,
  GraduationCap,
  Layers,
  Mail,
} from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "about", label: "About", icon: UserRound },
  { id: "journey", label: "Journey", icon: GraduationCap },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function MobileTabBar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const navigate = (id: string) => {
    setActive(id);

    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav className="mobile-tab-bar" aria-label="Mobile navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.id)}
            className={`mobile-tab ${isActive ? "active" : ""}`}
            aria-label={tab.label}
            aria-current={isActive ? "location" : undefined}
          >
            <span className="mobile-tab-icon">
              <Icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
            </span>
            <span className="mobile-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
