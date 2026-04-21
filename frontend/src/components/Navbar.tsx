import Link from "next/link";

const navItems = [
  { href: "/catalog", label: "Catalog" },
  { href: "/match", label: "Match" },
  { href: "/scan", label: "AI Scan" },
  { href: "/impact", label: "Impact" },
  { href: "/recipes", label: "Recipes" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-scrap-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
            ScrapSwap
          </span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 transition hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/list-waste"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
        >
          + List Waste
        </Link>
      </div>
    </header>
  );
}

