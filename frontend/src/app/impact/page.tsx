"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { type Category } from "@/lib/types";
import { fetchCategories } from "@/lib/api";

function fmt(n: number) {
  return Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n);
}

export default function ImpactPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [weightLbs, setWeightLbs] = useState(50);

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

  const metrics = useMemo(() => {
    const cat = categories.find(c => c.id === selectedCategoryId);
    if (!cat) return { score: 0, co2: 0, ch4: 0 };
    
    // Simple conversion lbs to kg for calculations if needed, but factors might already be lbs-based
    // For now assume factors are per unit weight (lb)
    const ch4 = weightLbs * (cat.methane_reduction_factor || 0);
    const co2 = weightLbs * (cat.co2_reduction_factor || 0);
    const score = ch4 * 100; // Arbitrary score for MVP
    
    return { score, co2, ch4 };
  }, [categories, selectedCategoryId, weightLbs]);

  return (
    <div className="scrap-bg py-10">
      <Container>
        <Panel>
          <PanelHeader
            title="Impact Dashboard"
            subtitle="Estimate CO₂ and methane savings for diverted materials."
          />

          <div className="grid gap-6 p-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-3xl border border-black/10 bg-cream-100 p-5 text-ink-950">
              <div className="text-sm font-semibold text-ink-800">Inputs</div>

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
                WEIGHT DIVERTED ({weightLbs} lbs)
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={5}
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(Number(e.target.value))}
                  className="mt-3 w-full accent-scrap-700"
                />
              </label>

              <div className="mt-5 rounded-2xl bg-white/60 px-4 py-3 text-xs text-ink-600">
                Formula: <span className="font-semibold">Methane Saved = Weight × Factor</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                  IMPACT SCORE
                </div>
                <div className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-cream-50">
                  {fmt(metrics.score)}
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Relative index (MVP estimate).
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                  CO₂ SAVED
                </div>
                <div className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-cream-50">
                  {fmt(metrics.co2)} kg
                </div>
                <div className="mt-2 text-xs text-white/60">
                  CO₂e savings estimate.
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                  METHANE AVOIDED
                </div>
                <div className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-cream-50">
                  {fmt(metrics.ch4)} kg
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Methane avoided estimate.
                </div>
              </div>

              <div className="md:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm font-semibold">Export (MVP)</div>
                  <button
                    onClick={() => {
                      const payload = {
                        categoryId: selectedCategoryId,
                        weightLbs,
                        impactScore: metrics.score,
                        co2SavedKg: metrics.co2,
                        methaneAvoidedKg: metrics.ch4,
                        generatedAt: new Date().toISOString(),
                      };
                      void navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
                  >
                    Copy JSON to clipboard
                  </button>
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Use this for ESG reports, dashboards, or API ingestion.
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </Container>
    </div>
  );
}

