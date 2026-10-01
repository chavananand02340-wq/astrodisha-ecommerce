import crypto from "crypto";
import { NextResponse } from "next/server";
import { finalizeOrder } from "@/lib/finalize-order";

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  let signatureOk = false;

  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Missing fields" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    signatureOk = safeEqual(expectedSignature, String(razorpay_signature));

    if (!signatureOk) {
      return NextResponse.json({ verified: false });
    }

    // Payment is genuine — create the order on the server (only once)
    const result = await finalizeOrder(String(razorpay_order_id), String(razorpay_payment_id));

    return NextResponse.json({
      verified: true,
      status: result.status,
      orderNumber: result.orderNumber,
      error: result.error,
    });
  } catch (error) {
    console.error("Payment verification / order error:", error);
    return NextResponse.json(
      { verified: signatureOk, status: "error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
