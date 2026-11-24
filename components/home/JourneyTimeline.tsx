import Icon, { type IconName } from "../ui/Icon";

/* "Not Just Chosen. Prepared For You." — six steps on one glowing gold line.
   Desktop: one row. Mobile: the same row, swipeable (no arrows — the line connects them). */

const STEPS: { title: string; text: string; icon: IconName }[] = [
  { title: "Discover", text: "Find what aligns with you.", icon: "search" },
  { title: "Authenticate", text: "Tested for authenticity and quality.", icon: "shield" },
  { title: "Purify", text: "Cleansed with traditional shuddhi.", icon: "droplet" },
  { title: "Consecrate", text: "Energised with mantra and sankalp.", icon: "sun" },
  { title: "Deliver", text: "Carefully packed to your doorstep.", icon: "box" },
  { title: "Align", text: "Guidance on how to wear and use.", icon: "compass" },
];

export default function JourneyTimeline() {
  return (
    <section className="relative overflow-hidden bg-[#160828] py-12 text-[#f4effb] sm:py-16">
      {/* faint cosmic glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(94, 62, 160, 0.55), transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="px-5 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d7b46a]">Not just chosen</p>
          <h2 className="astro-serif mt-2 text-[32px] leading-tight sm:text-[44px]">
            Prepared <span className="italic text-[#e3c27e]">for you</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-6 text-[#f4effb]/70">
            A sacred journey — from selection to guidance, crafted for your higher alignment.
          </p>
        </div>

        <ol
          aria-label="How every piece is prepared"
          className="no-scrollbar relative mt-9 flex snap-x snap-mandatory overflow-x-auto px-3 pb-2 sm:mt-12 lg:overflow-visible lg:px-8"
        >
          {/* the connecting line — runs from the first node's centre to the last */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[calc(0.75rem+66px)] top-[26px] h-px w-[calc(5*132px)] bg-gradient-to-r from-[#c6a15b]/30 via-[#c6a15b]/80 to-[#c6a15b]/30 lg:left-[calc(2rem+(100%-4rem)/12)] lg:w-[calc((100%-4rem)*10/12)]"
          >
            <div className="astro-line-flow absolute inset-x-0 -top-px h-[3px] blur-[1px]" />
          </div>

          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex w-[132px] shrink-0 snap-start flex-col items-center px-1.5 text-center lg:w-auto lg:flex-1">
              <span
                className="astro-node-glow relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a2160,#1b0c33)] text-[#e3c27e]"
                style={{ animationDelay: `${i * 0.6}s` }}
              >
                <Icon name={step.icon} className="h-[21px] w-[21px]" strokeWidth={1.6} />
              </span>
              <span className="mt-3 text-[10.5px] font-medium tracking-[0.2em] text-[#d7b46a]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="astro-serif mt-0.5 text-[15px] uppercase tracking-[0.06em] sm:text-[18px] sm:tracking-[0.1em]">{step.title}</h3>
              <p className="mt-1 text-[11.5px] leading-[1.45] text-[#f4effb]/65 sm:text-[12.5px]">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
