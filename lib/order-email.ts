import { Resend } from "resend";
import { WHATSAPP_NUMBER } from "@/lib/site";
import { SUPPORT_WHATSAPP_DISPLAY } from "@/lib/legal-info";

// Sender for all order emails (domain verified in Resend).
// Customer replies land in the Titan mailbox for this address.
const EMAIL_FROM = "ASTRODISHA <support@astrodisha.shop>";
const SITE_URL = "https://www.astrodisha.shop";

// Brand colours (emails can't use the site's CSS variables)
const PURPLE = "#2D1155";
const GOLD = "#C6A15B";
const TEXT = "#3E2237";
const MUTED = "#8A607A";
const LINE = "#E6D9C8";
const CREAM = "#F4ECE1";
const CARD = "#FFFDF9";

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
  couponCode?: string | null;
  paymentId?: string | null;
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

function indiaDate(withTime: boolean): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit", hour12: true } : {}),
  });
}

/* ---------------- CUSTOMER EMAIL ---------------- */

function buildCustomerEmail(d: OrderEmailData) {
  const orderId = "#AD" + d.orderNumber;
  const orderDate = indiaDate(false);
  const isCod = d.paymentMethod === "cod";
  const dueOnDelivery = Math.max(Number(d.totalAmount) - Number(d.advancePaid), 0);

  const itemsHtml = d.items
    .map(
      (item) => `
        <tr><td style="padding:10px 0 2px; font-size:15px; color:${TEXT};"><strong>${esc(item.name)}</strong></td></tr>
        <tr><td style="padding:0; font-size:14px; color:${MUTED};">Quantity: ${esc(item.quantity)}</td></tr>
        <tr><td style="padding:0 0 10px; font-size:14px; color:${MUTED}; border-bottom:1px solid ${LINE};">
          Price: ₹${inr(item.price)}${item.quantity > 1 ? ` &nbsp;·&nbsp; Amount: ₹${inr(item.price * item.quantity)}` : ""}
        </td></tr>`
    )
    .join("");

  const extraRows = [
    Number(d.discountAmount) > 0
      ? `<tr><td style="padding:3px 0; color:${GOLD};">Discount${d.couponCode ? ` (${esc(d.couponCode)})` : ""}</td><td style="padding:3px 0; text-align:right; color:${GOLD};">−₹${inr(d.discountAmount)}</td></tr>`
      : "",
    `<tr><td style="padding:3px 0; color:${MUTED};">Delivery</td><td style="padding:3px 0; text-align:right; color:${MUTED};">${Number(d.deliveryCharge) > 0 ? `₹${inr(d.deliveryCharge)}` : "FREE"}</td></tr>`,
  ].join("");

  const totalRows = isCod
    ? `
      <tr><td style="padding:6px 0 3px; color:${TEXT};">Order Total</td><td style="padding:6px 0 3px; text-align:right; color:${TEXT};">₹${inr(d.totalAmount)}</td></tr>
      <tr><td style="padding:3px 0; font-weight:bold; color:${PURPLE};">Total Paid (advance)</td><td style="padding:3px 0; text-align:right; font-weight:bold; color:${PURPLE};">₹${inr(d.advancePaid)}</td></tr>
      <tr><td style="padding:3px 0; color:${TEXT};">Balance on Delivery</td><td style="padding:3px 0; text-align:right; color:${TEXT};">₹${inr(dueOnDelivery)}</td></tr>`
    : `
      <tr><td style="padding:8px 0 3px; font-size:17px; font-weight:bold; color:${PURPLE};">Total Paid</td><td style="padding:8px 0 3px; text-align:right; font-size:17px; font-weight:bold; color:${PURPLE};">₹${inr(d.totalAmount)}</td></tr>`;

  const html = `
  <div style="background:${CREAM}; padding:24px 12px; font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:520px; margin:0 auto; background:${CARD}; border:1px solid ${LINE}; border-radius:16px; overflow:hidden;">

      <div style="background:${PURPLE}; padding:26px 20px; text-align:center;">
        <div style="color:#FFFFFF; font-size:26px; letter-spacing:3px;">ASTRODISHA</div>
        <div style="color:${GOLD}; font-size:11px; letter-spacing:2px; margin-top:8px; font-family:Arial,sans-serif;">GUIDANCE • HEALING • DIVINE ALIGNMENT</div>
      </div>

      <div style="padding:26px 24px 8px; color:${TEXT}; font-size:15px; line-height:1.65;">
        <p style="margin:0 0 14px;">Dear ${esc(d.customerName)},</p>
        <p style="margin:0 0 14px;">Thank you for choosing ASTRODISHA. 💜</p>
        <p style="margin:0 0 20px;">We’re delighted to confirm that your order has been successfully placed.</p>

        <div style="font-family:Arial,sans-serif; font-size:12px; font-weight:bold; letter-spacing:2px; color:${GOLD}; border-bottom:1px solid ${LINE}; padding-bottom:6px;">ORDER DETAILS</div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px; font-size:14px;">
          <tr><td style="padding:3px 0; color:${MUTED};">Order ID</td><td style="padding:3px 0; text-align:right; color:${TEXT};"><strong>${orderId}</strong></td></tr>
          <tr><td style="padding:3px 0; color:${MUTED};">Order Date</td><td style="padding:3px 0; text-align:right; color:${TEXT};">${orderDate}</td></tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          ${itemsHtml}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px; font-size:14px;">
          ${extraRows}
          ${totalRows}
        </table>

        <p style="margin:22px 0 14px;">Your order is now confirmed and will be carefully prepared for dispatch.
        We’ll keep you updated once your order is ready to be shipped.</p>
        <p style="margin:0 0 14px;">We truly appreciate your trust in ASTRODISHA and are grateful to be a part of your journey.</p>
        <p style="margin:0 0 14px;">May divine blessings, positivity and peace always surround you. ✨</p>
        <p style="margin:0 0 20px;">Wishing you abundance, harmony and beautiful energy.</p>

        <p style="margin:0;">With gratitude &amp; blessings,<br /><strong style="color:${PURPLE};">Team ASTRODISHA</strong></p>
      </div>

      <div style="margin-top:20px; padding:18px 20px; background:${CREAM}; border-top:1px solid ${LINE}; text-align:center; font-family:Arial,sans-serif;">
        <div style="color:${GOLD}; font-size:11px; letter-spacing:2px;">GUIDANCE • HEALING • DIVINE ALIGNMENT</div>
        <div style="color:${MUTED}; font-size:12px; margin-top:8px; line-height:1.6;">
          For any assistance, simply reply to this email or reach out to us on
          <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color:${PURPLE}; font-weight:bold;">WhatsApp (${esc(SUPPORT_WHATSAPP_DISPLAY)})</a>.
        </div>
      </div>
    </div>
  </div>`;

  const itemsText = d.items
    .map(
      (item) =>
        `Product:\n${item.name}\n\nQuantity: ${item.quantity}\nPrice: ₹${inr(item.price)}` +
        (item.quantity > 1 ? `\nAmount: ₹${inr(item.price * item.quantity)}` : "")
    )
    .join("\n\n");

  const extraText =
    (Number(d.discountAmount) > 0
      ? `Discount${d.couponCode ? ` (${d.couponCode})` : ""}: −₹${inr(d.discountAmount)}\n`
      : "") +
    `Delivery: ${Number(d.deliveryCharge) > 0 ? `₹${inr(d.deliveryCharge)}` : "FREE"}\n`;

  const totalText = isCod
    ? `Order Total: ₹${inr(d.totalAmount)}\nTotal Paid (advance): ₹${inr(d.advancePaid)}\nBalance on Delivery: ₹${inr(dueOnDelivery)}`
    : `Total Paid: ₹${inr(d.totalAmount)}`;

  const text = `ASTRODISHA
GUIDANCE • HEALING • DIVINE ALIGNMENT

Dear ${d.customerName},

Thank you for choosing ASTRODISHA. 💜

We’re delighted to confirm that your order has been successfully placed.

ORDER DETAILS

Order ID: ${orderId}
Order Date: ${orderDate}

${itemsText}

${extraText}${totalText}

Your order is now confirmed and will be carefully prepared for dispatch.
We’ll keep you updated once your order is ready to be shipped.

We truly appreciate your trust in ASTRODISHA and are grateful to be a part of your journey.

May divine blessings, positivity and peace always surround you. ✨

Wishing you abundance, harmony and beautiful energy.

With gratitude & blessings,
Team ASTRODISHA

GUIDANCE • HEALING • DIVINE ALIGNMENT

For any assistance, simply reply to this email or reach out to us on WhatsApp (${SUPPORT_WHATSAPP_DISPLAY}).`;

  return {
    subject: `Order Confirmed — ${orderId} 💜`,
    html,
    text,
  };
}

/* ---------------- ADMIN EMAIL ---------------- */

function buildAdminEmail(d: OrderEmailData) {
  const orderId = "#AD" + d.orderNumber;
  const orderDateTime = indiaDate(true);
  const isCod = d.paymentMethod === "cod";
  const dueOnDelivery = Math.max(Number(d.totalAmount) - Number(d.advancePaid), 0);
  const paidNow = isCod ? Number(d.advancePaid) : Number(d.totalAmount);
  const itemCount = d.items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const mobileDigits = String(d.customerMobile || "").replace(/\D/g, "");

  const cell = `padding:8px 6px; border-bottom:1px solid ${LINE}; font-size:13px; color:${TEXT};`;

  const itemRows = d.items
    .map(
      (item) => `
        <tr>
          <td style="${cell}"><strong>${esc(item.name)}</strong></td>
          <td style="${cell} text-align:center;">${esc(item.quantity)}</td>
          <td style="${cell} text-align:right;">₹${inr(item.price)}</td>
          <td style="${cell} text-align:right;"><strong>₹${inr(item.price * item.quantity)}</strong></td>
        </tr>`
    )
    .join("");

  const sumRow = (label: string, value: string, style = "") =>
    `<tr><td style="padding:4px 0; font-size:13px; color:${MUTED}; ${style}">${label}</td><td style="padding:4px 0; text-align:right; font-size:13px; color:${TEXT}; ${style}">${value}</td></tr>`;

  const infoRow = (label: string, value: string) =>
    `<tr><td style="padding:4px 0; width:38%; font-size:13px; color:${MUTED}; vertical-align:top;">${label}</td><td style="padding:4px 0; font-size:13px; color:${TEXT};">${value}</td></tr>`;

  const section = (title: string) =>
    `<div style="margin:20px 0 8px; font-size:11px; font-weight:bold; letter-spacing:1.5px; color:${GOLD}; border-bottom:1px solid ${LINE}; padding-bottom:5px;">${title}</div>`;

  const paymentBadge = isCod
    ? `<span style="background:#FFF3D6; color:#8A5A00; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:bold;">COD — ₹${inr(dueOnDelivery)} to collect</span>`
    : `<span style="background:#E3F4E6; color:#2E7D32; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:bold;">PAID ONLINE</span>`;

  const html = `
  <div style="background:${CREAM}; padding:20px 10px; font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px; margin:0 auto; background:${CARD}; border:1px solid ${LINE}; border-radius:14px; overflow:hidden;">

      <div style="background:${PURPLE}; padding:18px 20px;">
        <div style="color:${GOLD}; font-size:11px; letter-spacing:2px;">ASTRODISHA · NEW ORDER</div>
        <div style="color:#FFFFFF; font-size:22px; font-weight:bold; margin-top:4px;">🛒 ${orderId}</div>
        <div style="color:#E9DFF7; font-size:13px; margin-top:4px;">${orderDateTime} · ${itemCount} item${itemCount === 1 ? "" : "s"}</div>
      </div>

      <div style="padding:16px 20px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px; color:${MUTED};">Received now</td>
            <td style="text-align:right;">${paymentBadge}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:4px; font-size:28px; font-weight:bold; color:${PURPLE};">₹${inr(paidNow)}</td>
          </tr>
        </table>

        ${section("PRODUCTS ORDERED")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <th style="text-align:left; padding:6px; font-size:11px; color:${MUTED}; border-bottom:2px solid ${LINE};">Product</th>
            <th style="text-align:center; padding:6px; font-size:11px; color:${MUTED}; border-bottom:2px solid ${LINE};">Qty</th>
            <th style="text-align:right; padding:6px; font-size:11px; color:${MUTED}; border-bottom:2px solid ${LINE};">Price</th>
            <th style="text-align:right; padding:6px; font-size:11px; color:${MUTED}; border-bottom:2px solid ${LINE};">Amount</th>
          </tr>
          ${itemRows}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          ${sumRow("Subtotal", `₹${inr(d.subtotal)}`)}
          ${Number(d.discountAmount) > 0 ? sumRow(`Discount${d.couponCode ? ` (${esc(d.couponCode)})` : ""}`, `−₹${inr(d.discountAmount)}`) : ""}
          ${sumRow("Delivery", Number(d.deliveryCharge) > 0 ? `₹${inr(d.deliveryCharge)}` : "FREE")}
          ${sumRow("Order Total", `₹${inr(d.totalAmount)}`, `font-weight:bold; color:${PURPLE}; font-size:15px;`)}
          ${isCod ? sumRow("Advance paid online", `₹${inr(d.advancePaid)}`) : ""}
          ${isCod ? sumRow("To collect on delivery", `₹${inr(dueOnDelivery)}`, "font-weight:bold; color:#8A5A00;") : ""}
        </table>

        ${section("CUSTOMER")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${infoRow("Name", `<strong>${esc(d.customerName)}</strong>`)}
          ${infoRow(
            "Mobile",
            `<a href="tel:+91${esc(mobileDigits)}" style="color:${PURPLE}; font-weight:bold;">${esc(d.customerMobile)}</a>
             &nbsp;·&nbsp; <a href="https://wa.me/91${esc(mobileDigits)}" style="color:#2E7D32; font-weight:bold;">WhatsApp</a>`
          )}
          ${infoRow(
            "Email",
            d.customerEmail
              ? `<a href="mailto:${esc(d.customerEmail)}" style="color:${PURPLE};">${esc(d.customerEmail)}</a>`
              : "—"
          )}
        </table>

        ${section("SHIP TO")}
        <div style="font-size:13px; color:${TEXT}; line-height:1.6;">
          <strong>${esc(d.customerName)}</strong><br />
          ${esc(d.shippingAddress)}<br />
          ${esc(d.shippingCity)}, ${esc(d.shippingState)} — ${esc(d.shippingPinCode)}<br />
          Phone: ${esc(d.customerMobile)}
        </div>

        ${section("PAYMENT")}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${infoRow("Method", isCod ? "Cash on Delivery (advance paid online)" : "Paid fully online")}
          ${infoRow("Razorpay Payment ID", d.paymentId ? esc(d.paymentId) : "—")}
          ${infoRow("Coupon", d.couponCode ? esc(d.couponCode) : "—")}
        </table>

        <div style="text-align:center; margin-top:22px;">
          <a href="${SITE_URL}/admin/orders" style="display:inline-block; background:${PURPLE}; color:#FFFFFF; text-decoration:none; padding:12px 22px; border-radius:999px; font-size:14px; font-weight:bold;">Open Admin Orders →</a>
        </div>
      </div>
    </div>
  </div>`;

  const itemsText = d.items
    .map((item) => `- ${item.name} × ${item.quantity} @ ₹${inr(item.price)} = ₹${inr(item.price * item.quantity)}`)
    .join("\n");

  const text = `NEW ORDER ${orderId}
${orderDateTime}

${isCod ? `COD — advance ₹${inr(d.advancePaid)} paid, collect ₹${inr(dueOnDelivery)} on delivery` : `PAID ONLINE — ₹${inr(d.totalAmount)}`}

PRODUCTS
${itemsText}

Subtotal: ₹${inr(d.subtotal)}
${Number(d.discountAmount) > 0 ? `Discount${d.couponCode ? ` (${d.couponCode})` : ""}: −₹${inr(d.discountAmount)}\n` : ""}Delivery: ${Number(d.deliveryCharge) > 0 ? `₹${inr(d.deliveryCharge)}` : "FREE"}
Order Total: ₹${inr(d.totalAmount)}

CUSTOMER
${d.customerName}
Mobile: ${d.customerMobile}
Email: ${d.customerEmail || "-"}

SHIP TO
${d.shippingAddress}, ${d.shippingCity}, ${d.shippingState} - ${d.shippingPinCode}

Razorpay Payment ID: ${d.paymentId || "-"}

Admin: ${SITE_URL}/admin/orders`;

  return {
    subject: `🛒 New Order ${orderId} — ₹${inr(d.totalAmount)} · ${isCod ? "COD" : "Online"}`,
    html,
    text,
  };
}

/* ---------------- SEND ---------------- */

export async function sendOrderEmails(d: OrderEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is missing — order emails not sent.");
    return;
  }

  const resend = new Resend(apiKey);

  if (d.customerEmail) {
    const customer = buildCustomerEmail(d);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: d.customerEmail,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    });
    if (error) console.error("Customer email failed:", error);
  }

  // One or more admin emails, comma separated, e.g. "support@astrodisha.shop, owner@gmail.com"
  const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (adminEmails.length > 0) {
    const admin = buildAdminEmail(d);
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: adminEmails,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
    });
    if (error) console.error("Admin email failed:", error);
  } else {
    console.error("ADMIN_NOTIFICATION_EMAIL is missing — admin order email not sent.");
  }
        }
