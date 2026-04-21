"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { fetchRecipes } from "@/lib/api";
import { type Recipe } from "@/lib/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        const data = await fetchRecipes();
        const transformedData = data.map((r: any): Recipe & { category: string } => ({
          ...r,
          category: r.categories?.name || "Other",
          summary: r.description,
          time: "2-4 hours", // Placeholder if not in DB
          difficulty: "Medium", // Placeholder if not in DB
        }));
        setRecipes(transformedData as any);
      } catch (err: any) {
        console.error("Failed to load recipes:", err);
        setError("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }
    loadRecipes();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return recipes
      .filter((r) => (category === "All" ? true : r.category === category))
      .filter((r) =>
        query.length === 0
          ? true
          : [r.title, r.summary, r.category].join(" ").toLowerCase().includes(query),
      );
  }, [recipes, category, q]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    recipes.forEach((r) => set.add(r.category));
    return ["All", ...Array.from(set)];
  }, [recipes]);

  return (
    <div className="scrap-bg py-10">
      <Container>
        <Panel>
          <PanelHeader
            title="Recipe Library"
            subtitle="DIY instructions and blueprints for turning waste into products."
          />

          <div className="grid gap-6 p-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-3xl border border-black/10 bg-cream-100 p-5 text-ink-950">
              <div className="text-sm font-semibold text-ink-800">Browse</div>

              <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                SEARCH
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. denim, bio-leather"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                />
              </label>

              <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                CATEGORY
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              {error && (
                <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 rounded-2xl bg-white/60 px-4 py-3 text-xs text-ink-600">
                <span className="font-semibold">{filtered.length}</span> recipe
                {filtered.length === 1 ? "" : "s"} found.
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {loading ? (
                <div className="md:col-span-2 flex h-40 items-center justify-center text-ink-400">
                  Loading recipes...
                </div>
              ) : filtered.map((r) => (
                <Link
                  key={r.slug || r.id}
                  href={`/recipes/${r.slug || r.id}`}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition hover:bg-white/10"
                >
                  <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                    {(r.category || "OTHER").toUpperCase()}
                  </div>
                  <div className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-cream-50">
                    {r.title}
                  </div>
                  <p className="mt-3 text-sm text-white/70">{r.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                      {r.time}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                      {r.difficulty}
                    </span>
                  </div>
                  <div className="mt-5 text-sm font-semibold text-scrap-200 group-hover:text-scrap-100">
                    View recipe →
                  </div>
                </Link>
              ))}

              {!loading && filtered.length === 0 ? (
                <div className="md:col-span-2 rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-10 text-center text-sm text-white/70">
                  No recipes match your filters.
                </div>
              ) : null}
            </div>
          </div>
        </Panel>
      </Container>
    </div>
  );
}
