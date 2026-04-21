import { ButtonLink, Container, StatPill } from "@/components/ui";

export default function Home() {
  return (
    <div className="scrap-bg">
      <Container>
        <section className="mx-auto flex max-w-4xl flex-col items-center py-24 text-center md:py-28">
          <div className="text-xs font-semibold tracking-[0.32em] text-white/60">
            CIRCULAR ECONOMY MARKETPLACE
          </div>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-semibold leading-[1.05] tracking-tight text-cream-50 md:text-6xl">
            One industry&apos;s{" "}
            <span className="text-scrap-200 italic">waste</span> is another&apos;s
            raw material.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
            Connect with suppliers and creators to divert waste from landfills —
            and build something extraordinary from it.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/catalog" variant="secondary">
              Browse Materials
            </ButtonLink>
            <ButtonLink href="/match">Find a Match</ButtonLink>
          </div>

          <div className="mt-14 flex flex-col items-center gap-3 sm:flex-row">
            <StatPill label="lbs diverted" value="13,055" />
            <StatPill label="kg CO₂ saved" value="3,917" />
            <StatPill label="active listings" value="8" />
          </div>
        </section>
      </Container>
    </div>
  );
}
