import Link from "next/link";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { fetchRecipeBySlug } from "@/lib/api";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let recipe = null;
  let error = null;

  try {
    const data = await fetchRecipeBySlug(slug);
    recipe = {
      ...data,
      category: data.categories?.name || "Other",
      summary: data.description,
      time: "2-4 hours",
      difficulty: data.difficulty_level || "Medium",
      materials: Array.isArray(data.materials_needed) ? data.materials_needed : [],
      steps: Array.isArray(data.instructions) ? data.instructions : [],
      suitableFor: [data.categories?.name || "Organic"],
    };
  } catch (err) {
    console.error("Error fetching recipe:", err);
    error = "Recipe not found or server error";
  }

  if (!recipe) {
    return (
      <div className="scrap-bg py-10">
        <Container>
          <Panel>
            <PanelHeader title="Recipe not found" subtitle={error || ""} />
            <div className="p-6 text-ink-950">
              <Link href="/recipes" className="text-scrap-700 underline">
                Back to recipes
              </Link>
            </div>
          </Panel>
        </Container>
      </div>
    );
  }

  return (
    <div className="scrap-bg py-10">
      <Container>
        <Panel>
          <PanelHeader title={recipe.title} subtitle={recipe.summary} />
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border border-black/10 bg-white p-6 text-ink-950">
              <div className="text-sm font-semibold">Steps</div>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-ink-800">
                {recipe.steps.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>

            <div className="space-y-3">
              <div className="rounded-3xl border border-black/10 bg-cream-100 p-5 text-ink-950">
                <div className="text-xs font-semibold tracking-[0.24em] text-ink-600">
                  DETAILS
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-600">Category</span>
                    <span className="font-semibold">{recipe.category}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-600">Time</span>
                    <span className="font-semibold">{recipe.time}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-600">Difficulty</span>
                    <span className="font-semibold">{recipe.difficulty}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 bg-cream-100 p-5 text-ink-950">
                <div className="text-sm font-semibold">Materials</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-800">
                  {recipe.materials.map((m: string, i: number) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-black/10 bg-cream-100 p-5 text-ink-950">
                <div className="text-sm font-semibold">Suitable for</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recipe.suitableFor.map((t: string) => (
                    <span
                      key={t}
                      className="rounded-full bg-scrap-700 px-3 py-1 text-xs font-semibold text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href="/recipes"
                className="inline-flex w-full items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-cream-50"
              >
                Back to recipes
              </Link>
            </div>
          </div>
        </Panel>
      </Container>
    </div>
  );
}
