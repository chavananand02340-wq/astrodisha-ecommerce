import Header from "@/components/Header";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
            GET IN TOUCH
          </p>

          <h1 className="astro-serif mt-3 text-4xl text-[#3e2237] sm:text-6xl">
            Contact AstroDisha
          </h1>

          <div className="mt-8 space-y-4">
            <div className="border border-[#d9cec1] bg-[#fbf8f2] p-6">
              <p className="text-[10px] uppercase tracking-widest text-[#8a607a]">
                WhatsApp
              </p>

              <p className="mt-2 text-lg text-[#3e2237]">
                Chat with our team
              </p>
            </div>

            <div className="border border-[#d9cec1] bg-[#fbf8f2] p-6">
              <p className="text-[10px] uppercase tracking-widest text-[#8a607a]">
                Email
              </p>

              <p className="mt-2 text-lg text-[#3e2237]">
                support@astrodisha.com
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
