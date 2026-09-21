import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      orderNumber,
      customerName,
      customerEmail,
      customerMobile,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPinCode,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      advancePaid,
      items,
    }: {
      orderNumber: number;
      customerName: string;
      customerEmail: string | null;
      customerMobile: string;
      shippingAddress: string;
      shippingCity: string;
      shippingState: string;
      shippingPinCode: string;
      subtotal: number;
      deliveryCharge: number;
      totalAmount: number;
      paymentMethod: string;
      advancePaid: number;
      items: OrderItem[];
    } = body;

    const orderId = "AD" + orderNumber;
    const dueOnDelivery = totalAmount - advancePaid;

    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding:6px 0;">${item.name} × ${item.quantity}</td>
            <td style="padding:6px 0; text-align:right;">₹${(
              item.price * item.quantity
            ).toLocaleString("en-IN")}</td>
          </tr>`
      )
      .join("");

    const paymentSummaryHtml =
      paymentMethod === "cod"
        ? `<p><strong>Payment:</strong> Cash on Delivery — ₹${advancePaid} paid online, ₹${dueOnDelivery} due on delivery</p>`
        : `<p><strong>Payment:</strong> Paid Online — ₹${totalAmount}</p>`;

    const customerEmailHtml = `
      <div style="font-family: Georgia, serif; color: #3E2237; max-width: 500px; margin: 0 auto;">
        <h1 style="font-size: 20px;">ASTRODISHA</h1>
        <p style="color: #8A607A; font-size: 12px; letter-spacing: 1px;">GUIDANCE • HEALING • DIVINE ALIGNMENT</p>
        <hr style="border: none; border-top: 1px solid #D9CEC1;" />
        <h2 style="font-size: 18px;">Thank you for your order, ${customerName}!</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        ${paymentSummaryHtml}
        <table style="width: 100%; margin-top: 16px; border-collapse: collapse; font-size: 14px;">
          ${itemsHtml}
          <tr><td style="padding-top:10px; border-top:1px solid #D9CEC1;">Subtotal</td><td style="padding-top:10px; border-top:1px solid #D9CEC1; text-align:right;">₹${subtotal}</td></tr>
          <tr><td>Delivery</td><td style="text-align:right;">₹${deliveryCharge}</td></tr>
          <tr><td style="font-weight:bold;">Total</td><td style="text-align:right; font-weight:bold;">₹${totalAmount}</td></tr>
        </table>
        <h3 style="margin-top: 20px; font-size: 14px;">Shipping Address</h3>
        <p style="font-size: 13px;">${shippingAddress}, ${shippingCity}, ${shippingState} - ${shippingPinCode}</p>
        <p style="margin-top: 20px; font-size: 12px; color: #8A607A;">
          Need help? Reply to this email or reach us on WhatsApp.
        </p>
      </div>
    `;

    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #3E2237; max-width: 500px; margin: 0 auto;">
        <h2>New Order: ${orderId}</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Mobile:</strong> ${customerMobile}</p>
        <p><strong>Email:</strong> ${customerEmail || "-"}</p>
        ${paymentSummaryHtml}
        <table style="width: 100%; margin-top: 12px; border-collapse: collapse; font-size: 14px;">
          ${itemsHtml}
          <tr><td style="padding-top:10px; border-top:1px solid #D9CEC1;">Subtotal</td><td style="padding-top:10px; border-top:1px solid #D9CEC1; text-align:right;">₹${subtotal}</td></tr>
          <tr><td>Delivery</td><td style="text-align:right;">₹${deliveryCharge}</td></tr>
          <tr><td style="font-weight:bold;">Total</td><td style="text-align:right; font-weight:bold;">₹${totalAmount}</td></tr>
        </table>
        <p style="margin-top: 16px;"><strong>Shipping:</strong> ${shippingAddress}, ${shippingCity}, ${shippingState} - ${shippingPinCode}</p>
      </div>
    `;

    if (customerEmail) {
      await resend.emails.send({
        from: "ASTRODISHA <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Order Confirmed — ${orderId}`,
        html: customerEmailHtml,
      });
    }

    await resend.emails.send({
      from: "ASTRODISHA <onboarding@resend.dev>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL as string,
      subject: `New Order Received — ${orderId}`,
      html: adminEmailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
