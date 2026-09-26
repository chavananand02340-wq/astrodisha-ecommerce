import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import {
  LEGAL_NAME,
  GSTIN,
  REGISTERED_ADDRESS,
  JURISDICTION,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Terms & Conditions | ASTRODISHA",
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

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="26 September 2026">
      <p style={{ color: "var(--astro-mauve)" }} className="mb-7">
        These Terms & Conditions govern your use of theastrosoul.in, operated by {LEGAL_NAME}
        (GSTIN: {GSTIN}). By using this website or placing an order, you agree to these terms.
      </p>

      <Section heading="Use of the Website">
        <p>
          You agree to use this website only for lawful purposes and in a way that does not
          infringe the rights of others or restrict anyone else's use of the site.
        </p>
      </Section>

      <Section heading="Products & Descriptions">
        <p>
          We make every effort to describe our products (gemstones, crystals, crystal jewellery,
          Rudraksha, and puja essentials) accurately, including images and pricing. Natural
          products such as gemstones and Rudraksha may show minor natural variation from the
          photographs shown, which is normal and not a defect.
        </p>
      </Section>

      <Section heading="Pricing & Payments">
        <p>
          All prices are listed in Indian Rupees (₹) and may change without prior notice. Online
          payments are processed securely through Razorpay. Orders may also be placed with Cash on
          Delivery, subject to the advance amount described in our Cancellation & Refund Policy.
        </p>
      </Section>

      <Section heading="Order Acceptance">
        <p>
          Placing an order is an offer to purchase. We reserve the right to refuse or cancel any
          order — for example, in cases of pricing errors, stock unavailability, or suspected
          fraudulent activity — in which case any amount paid will be refunded.
        </p>
      </Section>

      <Section heading="Intellectual Property">
        <p>
          All content on this website, including text, images, and the ASTRODISHA name and logo,
          is the property of {LEGAL_NAME} and may not be reused without permission.
        </p>
      </Section>

      <Section heading="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, {LEGAL_NAME} is not liable for any indirect or
          consequential loss arising from the use of this website or our products. Please see our
          Disclaimer for details specific to our spiritual and gemstone products.
        </p>
      </Section>

      <Section heading="Governing Law & Jurisdiction">
        <p>
          These terms are governed by the laws of India. Any disputes will be subject to the
          exclusive jurisdiction of the courts in {JURISDICTION}.
        </p>
      </Section>

      <Section heading="Changes to These Terms">
        <p>
          We may update these Terms & Conditions from time to time. Continued use of the website
          after changes means you accept the updated terms.
        </p>
      </Section>

      <Section heading="Contact Us">
        <p>
          {LEGAL_NAME}
          <br />
          {REGISTERED_ADDRESS}
          <br />
          Email: {SUPPORT_EMAIL}
          <br />
          WhatsApp: {SUPPORT_WHATSAPP_DISPLAY}
        </p>
      </Section>
    </LegalPageLayout>
  );
}
