import type { Metadata } from "next";
import LegalPageLayout from "@/components/LegalPageLayout";
import {
  LEGAL_NAME,
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/lib/legal-info";

export const metadata: Metadata = {
  title: "Privacy Policy | ASTRODISHA",
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

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="26 September 2026">
      <p style={{ color: "var(--astro-mauve)" }} className="mb-7">
        This Privacy Policy explains how {LEGAL_NAME} ("we", "us", "our") collects, uses,
        and protects your information when you use our website theastrosoul.in.
      </p>

      <Section heading="Information We Collect">
        <ul className="list-disc space-y-1 pl-5">
          <li>Name, mobile number, and email address you provide at checkout or contact.</li>
          <li>Shipping address (address, city, state, PIN code) for order delivery.</li>
          <li>Order history and items purchased.</li>
          <li>Basic technical information such as browser type and device, for site functioning.</li>
        </ul>
        <p>
          We do not collect or store your card, UPI, or net banking details — these are handled
          directly and securely by our payment partner, Razorpay.
        </p>
      </Section>

      <Section heading="How We Use Your Information">
        <ul className="list-disc space-y-1 pl-5">
          <li>To process and deliver your orders.</li>
          <li>To send order confirmations and updates via email or WhatsApp.</li>
          <li>To respond to your questions or support requests.</li>
          <li>To improve our website and product offerings.</li>
        </ul>
      </Section>

      <Section heading="Sharing of Information">
        <p>
          We share your information only with trusted service providers who help us run our
          business — such as our payment gateway (Razorpay) and courier/shipping partners — solely
          to complete your order. We do not sell your personal information to third parties.
        </p>
      </Section>

      <Section heading="Data Security">
        <p>
          We follow reasonable, industry-standard security practices to protect your information.
          However, no method of transmission or storage over the internet is 100% secure, and we
          cannot guarantee absolute security.
        </p>
      </Section>

      <Section heading="Cookies">
        <p>
          Our website may use basic cookies to keep your cart and preferences working correctly
          while you browse. You can control cookies through your browser settings.
        </p>
      </Section>

      <Section heading="Your Rights">
        <p>
          You may request access to, correction of, or deletion of your personal information by
          contacting us at {SUPPORT_EMAIL} or {SUPPORT_WHATSAPP_DISPLAY}.
        </p>
      </Section>

      <Section heading="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated date.
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
