import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Missing fields" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const verified = expectedSignature === razorpay_signature;

    return NextResponse.json({ verified });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ verified: false, error: (error as Error).message }, { status: 500 });
  }
}
