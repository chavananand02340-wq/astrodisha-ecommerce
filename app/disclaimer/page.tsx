import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import { LEGAL_NAME, SUPPORT_EMAIL, SUPPORT_WHATSAPP_DISPLAY } from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Disclaimer | ASTRODISHA",
};

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-7 last:mb-0">
      <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mb-2 text-xl">
        {heading}
      </h2>
      <div style={{ color: "var(--astro-mauve)" }} className="space-y-2">
        {children}
      </div>
    </section>
  );
}

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="26 September 2026">
      <Section heading="Traditional & Spiritual Products">
        <p>
          {LEGAL_NAME} sells gemstones, crystals, crystal jewellery, Rudraksha, and puja
          essentials rooted in traditional and spiritual practices. Any properties, benefits, or
          significance associated with these products (such as those linked to astrology,
          energy, or wellbeing) are based on tradition and belief, not scientific proof.
        </p>
      </Section>

      <Section heading="Not Professional Advice">
        <p>
          Nothing on this website, including guidance shared by our team over WhatsApp, is a
          substitute for professional medical, legal, financial, or psychological advice. Please
          consult a qualified professional for decisions related to your health or finances.
        </p>
      </Section>

      <Section heading="Individual Results May Vary">
        <p>
          Any experience or outcome associated with using our products is personal and may vary
          from person to person. We do not guarantee specific results.
        </p>
      </Section>

      <Section heading="Product Appearance">
        <p>
          Being natural materials, gemstones and Rudraksha may show minor variations in colour,
          size, or texture compared to photographs shown on the website. This is normal and not
          considered a defect.
        </p>
      </Section>

      <Section heading="Questions">
        <p>
          If you have any questions about a product before purchasing, reach us on WhatsApp at{" "}
          {SUPPORT_WHATSAPP_DISPLAY} or email {SUPPORT_EMAIL}.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
