"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { suggestUses } from "@/lib/matching";
import { type Category, type Condition } from "@/lib/types";
import { fetchCategories } from "@/lib/api";

const conditions: Condition[] = ["Clean / Dry", "Mixed", "Wet"];
const industries = [
  "Food & Beverage",
  "Food Processing",
  "Apparel Manufacturing",
  "Textile Mill",
  "E-commerce",
  "Beverage",
];

export default function MatchPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [weightLbs, setWeightLbs] = useState<number>(50);
  const [condition, setCondition] = useState<Condition>("Clean / Dry");
  const [industrySource, setIndustrySource] = useState<string>("Food & Beverage");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
        if (data.length > 0) setSelectedCategoryId(data[0].id);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  const materialType = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId)?.name || "Organic";
  }, [categories, selectedCategoryId]);

  const result = useMemo(
    () => suggestUses({ materialType: materialType as any, condition, weightLbs, industrySource }),
    [materialType, condition, weightLbs, industrySource],
  );

  return (
    <div className="py-10" style={{ background: "var(--color-cream-50)" }}>
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel>
            <PanelHeader
              title="Matching Engine"
              subtitle="Describe your waste — we’ll suggest what it can become."
            />
            <div className="p-6">
              <div className="rounded-3xl border border-black/10 bg-cream-100 p-5">
                <div className="text-sm font-semibold text-ink-800">
                  Describe Your Waste
                </div>

                <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                  MATERIAL TYPE
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                  WEIGHT AVAILABLE
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      value={Number.isFinite(weightLbs) ? String(weightLbs) : ""}
                      onChange={(e) => setWeightLbs(Number(e.target.value || 0))}
                      placeholder="e.g. 50"
                      inputMode="numeric"
                      className="w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                    />
                    <div className="rounded-2xl bg-cream-200 px-4 py-3 text-sm font-semibold text-ink-800">
                      lbs
                    </div>
                  </div>
                </label>

                <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                  CONDITION
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as Condition)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                  >
                    {conditions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                  INDUSTRY SOURCE
                  <select
                    value={industrySource}
                    onChange={(e) => setIndustrySource(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                  >
                    {industries.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="mt-5 rounded-2xl bg-white/60 px-4 py-3 text-xs text-ink-600">
                  Tip: The more consistent the feedstock (sorted, dry), the more
                  predictable the results.
                </div>
              </div>
            </div>
          </Panel>

          <div className="rounded-3xl bg-scrap-950 p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-white/70">
                SUGGESTED USES
              </div>

              <div className="mt-6 w-full max-w-md space-y-3 text-left">
                {result.suggestedUses.map((u) => (
                  <div
                    key={u}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    <div className="font-semibold">{u}</div>
                    <div className="mt-1 text-xs text-white/60">
                      Based on {materialType.toLowerCase()} waste from{" "}
                      {industrySource}.
                    </div>
                  </div>
                ))}
              </div>

              {result.notes.length ? (
                <div className="mt-6 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-xs text-white/70">
                  <div className="font-semibold text-white">Notes</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

