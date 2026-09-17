import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
            ABOUT ASTRODISHA
          </p>

          <h1 className="astro-serif mt-3 text-4xl text-[#3e2237] sm:text-6xl">
            Guidance • Healing • Divine Alignment
          </h1>

          <p className="mt-7 text-sm leading-8 text-[#765f6d]">
            ASTRODISHA brings together authentic gemstones,
            crystals, Rudraksha and Puja essentials with a
            focus on thoughtful selection and meaningful
            spiritual practices.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              "Authentic Products",
              "Quality Assured",
              "Expert Guidance"
            ].map((item) => (
              <div
                key={item}
                className="border border-[#d9cec1] bg-[#fbf8f2] p-6"
              >
                <h2 className="astro-serif text-xl text-[#3e2237]">
                  {item}
                </h2>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
