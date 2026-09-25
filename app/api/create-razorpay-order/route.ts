import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, isAdvanceForCod } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const supabase = await createClient();

    // Server recalculates price, stock and totals from the database.
    // The browser's numbers are never trusted for the payment amount.
    const { data, error } = await supabase.rpc("calculate_order_total", {
      p_items: items,
      p_coupon_code: couponCode || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result || result.out_error) {
      return NextResponse.json(
        { error: result?.out_error || "Could not calculate order total." },
        { status: 400 }
      );
    }

    const advanceAmount = 100;
    const amountToCharge = isAdvanceForCod ? advanceAmount : Number(result.out_total_amount);

    if (!amountToCharge || amountToCharge <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amountToCharge * 100),
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    return NextResponse.json({
      order,
      subtotal: result.out_subtotal,
      discountAmount: result.out_discount_amount,
      deliveryCharge: result.out_delivery_charge,
      totalAmount: result.out_total_amount,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
