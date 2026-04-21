import Link from "next/link";
import { type ReactNode } from "react";

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5">{children}</div>;
}

export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-cream-50 text-ink-950 shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
      {children}
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-black/10 px-6 py-5">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1 text-sm text-ink-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls =
    variant === "primary"
      ? "bg-scrap-700 text-white hover:bg-scrap-600 border-white/10"
      : "bg-white/10 text-white hover:bg-white/15 border-white/15";
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition ${cls}`}
    >
      {children}
    </Link>
  );
}

export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[180px] rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center">
      <div className="font-[family-name:var(--font-display)] text-3xl font-semibold text-scrap-200">
        {value}
      </div>
      <div className="mt-1 text-xs font-semibold tracking-[0.24em] text-white/60">
        {label.toUpperCase()}
      </div>
    </div>
  );
}

