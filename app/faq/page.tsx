import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import {
  CANCELLATION_WINDOW_HOURS,
  COD_ADVANCE_AMOUNT,
  REFUND_PROCESSING_DAYS,
  STANDARD_DELIVERY_DAYS,
  MUHURAT_DELIVERY_DAYS,
  JURISDICTION,
  LEGAL_NAME,
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "FAQs | ASTRODISHA",
};

const FAQS = [
  {
    q: "How can I reach customer support?",
    a: `You can contact ASTRODISHA customer support through WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}, or by email at ${SUPPORT_EMAIL}. Our team is happy to help with your queries.`,
  },
  {
    q: "What is the order cancellation window?",
    a: `An order can be cancelled within ${CANCELLATION_WINDOW_HOURS} hours of placing it. Cancellation within ${CANCELLATION_WINDOW_HOURS} hours gets a full refund. Cancellation after ${CANCELLATION_WINDOW_HOURS} hours means the ₹${COD_ADVANCE_AMOUNT} advance amount is non-refundable.`,
  },
  {
    q: "What is the return policy?",
    a: "Returns are accepted only if the product is received defective or damaged. A clear, continuous opening/unboxing video showing the condition of the package and product is required. Change-of-mind returns are not accepted.",
  },
  {
    q: "Is an opening/unboxing video mandatory for a return?",
    a: "Yes. It is mandatory for claiming a return due to product damage or defect. Without it, a return claim may not be accepted.",
  },
  {
    q: "How long does the refund take?",
    a: `Once a return/refund is approved and verification is complete, the refund is processed within ${REFUND_PROCESSING_DAYS}.`,
  },
  {
    q: "What is the standard delivery time?",
    a: `Standard delivery usually takes ${STANDARD_DELIVERY_DAYS}, depending on the delivery location and courier service.`,
  },
  {
    q: "Can I request delivery according to a Muhurat or ritual timing?",
    a: `Yes. If you request delivery according to a specific Muhurat, ritual, or auspicious timing, the order may take ${MUHURAT_DELIVERY_DAYS}.`,
  },
  {
    q: "What is the COD advance amount?",
    a: `For COD orders, an advance of ₹${COD_ADVANCE_AMOUNT} is required at the time of placing the order. This amount is adjusted against the total order value.`,
  },
  {
    q: `Is the ₹${COD_ADVANCE_AMOUNT} COD advance refundable?`,
    a: `Yes, if the order is cancelled within ${CANCELLATION_WINDOW_HOURS} hours, the complete amount including the advance is refunded. After ${CANCELLATION_WINDOW_HOURS} hours, the advance is not refundable.`,
  },
  {
    q: "Which products are non-returnable?",
    a: "Products are eligible for return only in case of a verified product defect or damage, subject to the mandatory opening/unboxing video. Returns for change of mind, personal preference, or incorrect selection are not accepted.",
  },
  {
    q: "What is the legal jurisdiction for ASTRODISHA?",
    a: `${JURISDICTION}.`,
  },
  {
    q: "What is the registered business name and address?",
    a: `Registered Business Name: ${LEGAL_NAME}. Registered Address: ${REGISTERED_ADDRESS}.`,
  },
  {
    q: "What is the ASTRODISHA website URL?",
    a: "theastrosoul.in",
  },
  {
    q: "What is the customer support email?",
    a: SUPPORT_EMAIL,
  },
];

export default function FaqPage() {
  return (
    <LegalPageLayout title="Frequently Asked Questions" lastUpdated="26 September 2026">
      <div className="flex flex-col gap-6">
        {FAQS.map((item) => (
          <div key={item.q}>
            <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-lg">
              {item.q}
            </h2>
            <p style={{ color: "var(--astro-mauve)" }} className="mt-1.5">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </LegalPageLayout>
  );
}
