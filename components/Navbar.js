"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const liens = [
  { href: "/produits", label: "Catalogue" },
  { href: "/commercant", label: "Commerçant" },
  { href: "/operateur", label: "Travailler", cta: true },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY;

      setVisible(!(current > lastScroll.current && current > 80));
      setScrolled(current > 10);
      lastScroll.current = current;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${visible ? "translate-y-0" : "-translate-y-full"} ${scrolled ? "border-b border-white/10 bg-black/45 backdrop-blur-xl" : "bg-transparent"}`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="text-2xl font-bold text-orange-400">
          Konect
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Navigation principale">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className={
                lien.cta
                  ? "rounded-lg bg-orange-500/90 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                  : "rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              }
            >
              {lien.label}
            </Link>
          ))}
        </nav>

        <MenuMobile />
      </div>
    </header>
  );
}

function MenuMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((etat) => !etat)}
        className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-xl font-bold leading-none text-white backdrop-blur transition hover:bg-white/15"
        aria-expanded={open}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {open ? "×" : "☰"}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full flex flex-col gap-3 border-t border-white/10 bg-black/85 p-5 backdrop-blur-xl">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              onClick={() => setOpen(false)}
              className={
                lien.cta
                  ? "rounded-lg bg-orange-500 py-3 text-center font-semibold text-black"
                  : "py-2 text-white/90"
              }
            >
              {lien.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
