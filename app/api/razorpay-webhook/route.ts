import crypto from "crypto";
import { NextResponse } from "next/server";
import { finalizeOrder } from "@/lib/finalize-order";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is missing.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Signature must be checked on the exact raw body Razorpay sent
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (!signature || !safeEqual(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType: string = event?.event || "";

  try {
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = event?.payload?.payment?.entity;
      const razorpayOrderId: string | undefined =
        payment?.order_id || event?.payload?.order?.entity?.id;
      const razorpayPaymentId: string | undefined = payment?.id;

      if (!razorpayOrderId || !razorpayPaymentId) {
        return NextResponse.json({ ok: true, ignored: "missing ids" });
      }

      const result = await finalizeOrder(razorpayOrderId, razorpayPaymentId);

      if (result.status === "failed") {
        console.error(
          `Paid but order failed — Razorpay order ${razorpayOrderId}, payment ${razorpayPaymentId}: ${result.error}`
        );
      }

      // 200 for completed / failed / not_found: retrying won't change these
      return NextResponse.json({ ok: true, status: result.status });
    }

    if (eventType === "payment.failed") {
      const payment = event?.payload?.payment?.entity;
      console.log(
        `Payment failed — order ${payment?.order_id}, payment ${payment?.id}: ${payment?.error_description || ""}`
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: eventType });
  } catch (error) {
    // Temporary problem (e.g. database unreachable): 500 makes Razorpay retry later
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
