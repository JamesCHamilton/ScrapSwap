"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { fetchListings } from "@/lib/api";
import { type WasteListing } from "@/lib/types";

export default function CatalogPage() {
  const [listings, setListings] = useState<WasteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("All");
  const [maxMiles, setMaxMiles] = useState(25);

  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const data = await fetchListings();
        // Transform backend data to frontend-friendly structure
        const transformedData = data.map((w: any) => ({
          ...w,
          materialType: w.categories?.name || "Organic",
          weightLbs: w.quantity, // Assume quantity is in lbs for now
          industrySource: w.categories?.name || "Various",
          condition: "Clean / Dry", // Default
          tags: [],
        }));
        setListings(transformedData);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load listings:", err);
        setError("Unable to connect to backend. Please make sure the server is running.");
      } finally {
        setLoading(false);
      }
    }
    loadListings();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings
      .filter((w) => (type === "All" ? true : w.materialType === type))
      .filter((w) =>
        q.length === 0
          ? true
          : [w.title, w.industrySource, w.location, ...(w.tags || [])]
              .join(" ")
              .toLowerCase()
              .includes(q),
      )
      .map((w) => ({
        ...w,
        distanceMiles:
          3 + (w.id.charCodeAt(w.id.length - 1) % Math.max(1, maxMiles)),
      }))
      .filter((w) => w.distanceMiles <= maxMiles);
  }, [listings, query, type, maxMiles]);

  const materialTypes = ["Food Waste", "Textiles", "Plastic", "Wood Scraps", "Coffee Grounds"];

  return (
    <div className="scrap-bg py-10">
      <Container>
        <Panel>
          <PanelHeader
            title="Waste Catalog"
            subtitle="Browse materials by type, location, and availability."
          />

          <div className="grid gap-6 p-6 lg:grid-cols-[360px_1fr]">
            <div className="rounded-3xl border border-black/10 bg-cream-100 p-5">
              <div className="text-sm font-semibold text-ink-800">Filters</div>

              <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                SEARCH
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. denim, coffee, NYC"
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                />
              </label>

              <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                MATERIAL TYPE
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-black/10 bg-cream-50 px-4 py-3 text-sm outline-none ring-scrap-600/25 focus:ring-4"
                >
                  <option value="All">All</option>
                  {materialTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block text-xs font-semibold tracking-wide text-ink-600">
                MAX DISTANCE ({maxMiles} mi)
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={maxMiles}
                  onChange={(e) => setMaxMiles(Number(e.target.value))}
                  className="mt-3 w-full accent-scrap-700"
                />
              </label>

              {error && (
                <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 rounded-2xl bg-white/60 px-4 py-3 text-xs text-ink-600">
                Showing <span className="font-semibold">{results.length}</span>{" "}
                listing{results.length === 1 ? "" : "s"}.
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex h-40 items-center justify-center text-ink-400">
                  Loading materials...
                </div>
              ) : results.map((w) => (
                <div
                  key={w.id}
                  className="rounded-3xl border border-black/10 bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-lg font-semibold text-ink-950">
                        {w.title}
                      </div>
                      <div className="mt-1 text-sm text-ink-600">
                        {w.location} · {w.industrySource}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-scrap-700 px-3 py-1 text-xs font-semibold text-white">
                        {w.materialType}
                      </span>
                      <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-800">
                        {w.condition}
                      </span>
                      <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-800">
                        {w.weightLbs} lbs
                      </span>
                      <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold text-ink-800">
                        ~{w.distanceMiles} mi
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && results.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-black/20 bg-white px-6 py-10 text-center text-sm text-ink-600">
                  No results found. Try adjusting your filters.
                </div>
              ) : null}
            </div>
          </div>
        </Panel>
      </Container>
    </div>
  );
}

