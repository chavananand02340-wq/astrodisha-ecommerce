import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import {
  CANCELLATION_WINDOW_HOURS,
  COD_ADVANCE_AMOUNT,
  REFUND_PROCESSING_DAYS,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | ASTRODISHA",
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

export default function CancellationRefundPage() {
  return (
    <LegalPageLayout title="Cancellation & Refund Policy" lastUpdated="26 September 2026">
      <Section heading="Order Cancellation Window">
        <p>
          An order can be cancelled within {CANCELLATION_WINDOW_HOURS} hours of placing it.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Cancellation within {CANCELLATION_WINDOW_HOURS} hours — the full amount paid is refunded.</li>
          <li>
            Cancellation after {CANCELLATION_WINDOW_HOURS} hours — the ₹{COD_ADVANCE_AMOUNT} advance
            amount is non-refundable.
          </li>
        </ul>
      </Section>

      <Section heading="Cash on Delivery (COD) Advance">
        <p>
          For COD orders, an advance of ₹{COD_ADVANCE_AMOUNT} is collected online at the time of
          placing the order. This amount is adjusted against the total order value — it is not an
          extra charge.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            If the order is cancelled within {CANCELLATION_WINDOW_HOURS} hours, the complete amount,
            including the ₹{COD_ADVANCE_AMOUNT} advance, is refunded.
          </li>
          <li>
            If the order is cancelled after {CANCELLATION_WINDOW_HOURS} hours, the ₹{COD_ADVANCE_AMOUNT}{" "}
            advance is not refundable.
          </li>
        </ul>
      </Section>

      <Section heading="Return Eligibility">
        <p>Returns are accepted only if a product is received defective or damaged.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            A clear, continuous opening/unboxing video showing the condition of the package and
            product is mandatory to claim a return. Without this video, a return claim may not be
            accepted.
          </li>
          <li>
            If a manufacturing or product defect is confirmed, the return is processed as per this
            policy.
          </li>
          <li>
            Change-of-mind returns, or returns for reasons other than a verified product defect or
            damage, are not accepted.
          </li>
        </ul>
      </Section>

      <Section heading="Refund Timeline">
        <p>
          Once a return or refund is approved and the required verification is complete, the refund
          is processed within {REFUND_PROCESSING_DAYS}.
        </p>
      </Section>

      <Section heading="Questions About Your Order">
        <p>
          For any cancellation, return, or refund query, reach us on WhatsApp at{" "}
          {SUPPORT_WHATSAPP_DISPLAY}.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
