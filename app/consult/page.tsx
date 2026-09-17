import Link from "next/link";
import Header from "@/components/Header";

export default function ConsultPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
            EXPERT GUIDANCE
          </p>

          <h1 className="astro-serif mt-4 text-4xl leading-tight text-[#3e2237] sm:text-6xl">
            Find What Aligns With You.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#765f6d]">
            Connect with AstroDisha for guidance around gemstones,
            crystals, Rudraksha and spiritual practices.
          </p>

          <a
            href="https://wa.me/"
            className="mt-8 inline-block rounded-sm bg-[#5a3150] px-8 py-4 text-xs font-semibold text-white"
          >
            Continue on WhatsApp
          </a>
        </section>
      </main>
    </>
  );
}
