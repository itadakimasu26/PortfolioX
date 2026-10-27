import { useEffect, useRef, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import AnimatedTitle from "./AnimatedTitle.jsx";

const links = [
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "TECH STACK", href: "#tech-stack" },
  { label: "CONTACT ME", href: "#contact", contact: true },
];

export default function Header() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [frosted, setFrosted] = useState(() => window.scrollY > 12);
  const [theme, setTheme] = useState(() => {
    const initial = document.documentElement.dataset.theme;
    return initial === "dark" || initial === "light"
      ? initial
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  });
  const headerRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = theme === "dark" ? "#101713" : "#F5F3ED";
    }
  }, [theme]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event) => {
      try {
        if (localStorage.getItem("portfolio-theme")) return;
      } catch {
        // Continue following the operating system if storage is unavailable.
      }
      setTheme(event.matches ? "dark" : "light");
    };
    preference.addEventListener("change", followSystem);
    return () => preference.removeEventListener("change", followSystem);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      // Theme switching remains available without persistent storage.
    }
  };

  useEffect(() => {
    const updateFrosted = () => setFrosted(window.scrollY > 12);
    window.addEventListener("scroll", updateFrosted, { passive: true });
    return () => window.removeEventListener("scroll", updateFrosted);
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        headerRef.current?.querySelector(".menu-toggle")?.focus();
      }
    };
    const closeOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActive(`#${visible[0].target.id}`);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`site-header${frosted ? " is-frosted" : ""}`}
      ref={headerRef}
    >
      <div className="site-header__inner">
        <div className="brand">
          <a
            className="brand__name"
            href="#top"
            aria-label="Michael John Ojoy, back to top"
          >
            MICHAEL JOHN OJOY
          </a>
          <AnimatedTitle />
        </div>
        <button
          className="theme-toggle"
          type="button"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <FiSun aria-hidden="true" />
          ) : (
            <FiMoon aria-hidden="true" />
          )}
        </button>
        <button
          className="menu-toggle"
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <FiX aria-hidden="true" />
          ) : (
            <FiMenu aria-hidden="true" />
          )}
        </button>
        <nav
          className={`nav${menuOpen ? " is-open" : ""}`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          {links.map(({ label, href, contact }) => (
            <a
              key={href}
              href={href}
              className={`nav__link${contact ? " nav__contact" : ""}${active === href ? " is-active" : ""}`}
              aria-current={active === href ? "location" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
