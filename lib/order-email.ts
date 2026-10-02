import { Resend } from "resend";

// Sender for all order emails (domain verified in Resend).
// Customer replies land in the Titan mailbox for this address.
const EMAIL_FROM = "ASTRODISHA <support@astrodisha.shop>";

export type OrderEmailItem = {
  name: string;
  price: number;
  quantity: number;
};

export type OrderEmailData = {
  orderNumber: number;
  customerName: string;
  customerEmail: string | null;
  customerMobile: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  advancePaid: number;
  items: OrderEmailItem[];
};

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inr(value: number): string {
  return Number(value || 0).toLocaleString("en-IN");
}

export async function sendOrderEmails(d: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing — order emails not sent.");
    return;
  }

  const resend = new Resend(apiKey);

  const orderId = "AD" + d.orderNumber;
  const dueOnDelivery = Math.max(Number(d.totalAmount) - Number(d.advancePaid), 0);

  const itemsHtml = d.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 0;">${esc(item.name)} × ${esc(item.quantity)}</td>
          <td style="padding:6px 0; text-align:right;">₹${inr(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const discountRowHtml =
    Number(d.discountAmount) > 0
      ? `<tr><td style="color:#C6A15B;">Discount</td><td style="text-align:right; color:#C6A15B;">−₹${inr(d.discountAmount)}</td></tr>`
      : "";

  const paymentSummaryHtml =
    d.paymentMethod === "cod"
      ? `<p><strong>Payment:</strong> Cash on Delivery — ₹${inr(d.advancePaid)} paid online, ₹${inr(dueOnDelivery)} due on delivery</p>`
      : `<p><strong>Payment:</strong> Paid Online — ₹${inr(d.totalAmount)}</p>`;

  const totalsHtml = `
    <tr><td style="padding-top:10px; border-top:1px solid #D9CEC1;">Subtotal</td><td style="padding-top:10px; border-top:1px solid #D9CEC1; text-align:right;">₹${inr(d.subtotal)}</td></tr>
    ${discountRowHtml}
    <tr><td>Delivery</td><td style="text-align:right;">₹${inr(d.deliveryCharge)}</td></tr>
    <tr><td style="font-weight:bold;">Total</td><td style="text-align:right; font-weight:bold;">₹${inr(d.totalAmount)}</td></tr>
  `;

  const shippingLine = `${esc(d.shippingAddress)}, ${esc(d.shippingCity)}, ${esc(d.shippingState)} - ${esc(d.shippingPinCode)}`;

  const customerEmailHtml = `
    <div style="font-family: Georgia, serif; color: #3E2237; max-width: 500px; margin: 0 auto;">
      <h1 style="font-size: 20px;">ASTRODISHA</h1>
      <p style="color: #8A607A; font-size: 12px; letter-spacing: 1px;">GUIDANCE • HEALING • DIVINE ALIGNMENT</p>
      <hr style="border: none; border-top: 1px solid #D9CEC1;" />
      <h2 style="font-size: 18px;">Thank you for your order, ${esc(d.customerName)}!</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      ${paymentSummaryHtml}
      <table style="width: 100%; margin-top: 16px; border-collapse: collapse; font-size: 14px;">
        ${itemsHtml}
        ${totalsHtml}
      </table>
      <h3 style="margin-top: 20px; font-size: 14px;">Shipping Address</h3>
      <p style="font-size: 13px;">${shippingLine}</p>
      <p style="margin-top: 20px; font-size: 12px; color: #8A607A;">
        Need help? Reply to this email or reach us on WhatsApp.
      </p>
    </div>
  `;

  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; color: #3E2237; max-width: 500px; margin: 0 auto;">
      <h2>New Order: ${orderId}</h2>
      <p><strong>Customer:</strong> ${esc(d.customerName)}</p>
      <p><strong>Mobile:</strong> ${esc(d.customerMobile)}</p>
      <p><strong>Email:</strong> ${esc(d.customerEmail || "-")}</p>
      ${paymentSummaryHtml}
      <table style="width: 100%; margin-top: 12px; border-collapse: collapse; font-size: 14px;">
        ${itemsHtml}
        ${totalsHtml}
      </table>
      <p style="margin-top: 16px;"><strong>Shipping:</strong> ${shippingLine}</p>
    </div>
  `;

  if (d.customerEmail) {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: d.customerEmail,
      subject: `Order Confirmed — ${orderId}`,
      html: customerEmailHtml,
    });
    if (error) console.error("Customer email failed:", error);
  }

  // One or more admin emails, comma separated, e.g. "support@astrodisha.shop, owner@gmail.com"
  const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmails,
      subject: `New Order Received — ${orderId}`,
      html: adminEmailHtml,
    });
    if (error) console.error("Admin email failed:", error);
  } else {
    console.error("ADMIN_NOTIFICATION_EMAIL is missing — admin order email not sent.");
  }
      }
