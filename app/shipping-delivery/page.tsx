import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import {
  STANDARD_DELIVERY_DAYS,
  MUHURAT_DELIVERY_DAYS,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | ASTRODISHA",
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

export default function ShippingDeliveryPage() {
  return (
    <LegalPageLayout title="Shipping & Delivery Policy" lastUpdated="26 September 2026">
      <Section heading="Standard Delivery">
        <p>
          Standard delivery usually takes {STANDARD_DELIVERY_DAYS}, depending on the delivery
          location and the courier partner handling the shipment.
        </p>
      </Section>

      <Section heading="Muhurat / Ritual-Timed Delivery">
        <p>
          If you would like your order delivered according to a specific Muhurat, ritual, or
          auspicious timing, please let us know at the time of ordering (or via WhatsApp right
          after). Such orders may take {MUHURAT_DELIVERY_DAYS}, depending on the selected Muhurat
          and any preparation requirements.
        </p>
      </Section>

      <Section heading="Delivery Coverage">
        <p>We currently deliver across India (Pan India delivery).</p>
      </Section>

      <Section heading="Delays">
        <p>
          Occasionally, deliveries may be delayed due to courier disruptions, weather, regional
          restrictions, or other circumstances beyond our control. We will keep you informed if
          your order is affected.
        </p>
      </Section>

      <Section heading="Questions About Delivery">
        <p>
          For any delivery-related query, including requesting a Muhurat-based delivery, reach us
          on WhatsApp at {SUPPORT_WHATSAPP_DISPLAY}.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
