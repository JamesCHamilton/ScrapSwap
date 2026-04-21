"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { type Category, type Condition } from "@/lib/types";
import { suggestUses } from "@/lib/matching";
import { co2SavedKg } from "@/lib/impact";
import { createListing, fetchCategories } from "@/lib/api";

const conditions: Condition[] = ["Clean / Dry", "Mixed", "Wet"];

export default function ListWastePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [title, setTitle] = useState("Spent coffee grounds");
  const [condition, setCondition] = useState<Condition>("Clean / Dry");
  const [industrySource, setIndustrySource] = useState("Food & Beverage");
  const [location, setLocation] = useState("Brooklyn, NY");
  const [weightLbs, setWeightLbs] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

  const preview = useMemo(() => {
    const { suggestedUses } = suggestUses({
      materialType: materialType as any,
      condition,
      weightLbs,
      industrySource,
    });
    const co2 = co2SavedKg(weightLbs, materialType as any);
    return { suggestedUses, co2 };
  }, [materialType, condition, weightLbs, industrySource]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage(null);
      
      const payload = {
        title,
        category_id: selectedCategoryId,
        quantity: weightLbs,
        unit: "lbs",
        location,
        status: "available",
        // In a real app, supplier_id would come from auth
        // supplier_id: "...", 
      };

      await createListing(payload);
      setMessage("Listing created successfully!");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scrap-bg py-10">
      <Container>
        <Panel>
          <PanelHeader
            title="List Waste"
            subtitle="Create a listing for suppliers — preview matches and impact instantly."
          />

          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-ink-950">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs font-semibold tracking-wide text-ink-600">
                  LISTING TITLE
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                    placeholder="e.g. 50 lbs coffee grounds"
                  />
                </label>

                <label className="block text-xs font-semibold tracking-wide text-ink-600">
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

                <label className="block text-xs font-semibold tracking-wide text-ink-600">
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

                <label className="block text-xs font-semibold tracking-wide text-ink-600">
                  WEIGHT (LBS)
                  <input
                    value={String(weightLbs)}
                    onChange={(e) => setWeightLbs(Number(e.target.value || 0))}
                    inputMode="numeric"
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                  />
                </label>

                <label className="block text-xs font-semibold tracking-wide text-ink-600">
                  INDUSTRY SOURCE
                  <input
                    value={industrySource}
                    onChange={(e) => setIndustrySource(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                    placeholder="e.g. Food & Beverage"
                  />
                </label>

                <label className="block text-xs font-semibold tracking-wide text-ink-600">
                  LOCATION
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                    placeholder="e.g. Brooklyn, NY"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full border border-black/10 bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create listing"}
                </button>
                {message && (
                  <div className={`text-xs ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                  PREVIEW
                </div>
                <div className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-cream-50">
                  {title || "Untitled listing"}
                </div>
                <div className="mt-2 text-sm text-white/70">
                  {location} · {industrySource}
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                    {materialType}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                    {condition}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                    {weightLbs} lbs
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                  MATCH IDEAS
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/80">
                  {preview.suggestedUses.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
                <div className="text-xs font-semibold tracking-[0.24em] text-white/60">
                  ESTIMATED CO₂ SAVED
                </div>
                <div className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-cream-50">
                  {Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(
                    preview.co2,
                  )}{" "}
                  kg
                </div>
                <div className="mt-2 text-xs text-white/60">
                  MVP estimate; replace with authoritative factors when ready.
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </Container>
    </div>
  );
}

