import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { COD_ADVANCE_AMOUNT } from "@/lib/legal-info";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

type CheckoutItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, isAdvanceForCod, customer } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Keep only the fields we need from the browser's cart
    const cleanItems: CheckoutItem[] = items.map((item: any) => ({
      id: String(item?.id ?? ""),
      name: clean(item?.name, 200),
      price: Number(item?.price) || 0,
      quantity: Math.floor(Number(item?.quantity) || 0),
    }));

    if (cleanItems.some((item) => !item.id || item.quantity <= 0)) {
      return NextResponse.json({ error: "Your cart has an invalid item." }, { status: 400 });
    }

    const c = {
      name: clean(customer?.name, 120),
      mobile: clean(customer?.mobile, 20),
      email: clean(customer?.email, 200),
      address: clean(customer?.address, 500),
      city: clean(customer?.city, 100),
      state: clean(customer?.state, 100),
      pinCode: clean(customer?.pinCode, 20),
      country: clean(customer?.country, 60) || "India",
    };

    if (
      !c.name ||
      !/^\d{10}$/.test(c.mobile) ||
      !c.address ||
      !c.city ||
      !c.state ||
      !/^\d{6}$/.test(c.pinCode)
    ) {
      return NextResponse.json(
        { error: "Please fill in all required delivery details." },
        { status: 400 }
      );
    }

    const coupon = clean(couponCode, 50) || null;

    const supabase = await createClient();

    // Server recalculates price, stock and totals from the database.
    // The browser's numbers are never trusted for the payment amount.
    const { data, error } = await supabase.rpc("calculate_order_total", {
      p_items: cleanItems,
      p_coupon_code: coupon,
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

    const amountToCharge = isAdvanceForCod
      ? COD_ADVANCE_AMOUNT
      : Number(result.out_total_amount);

    if (!amountToCharge || amountToCharge <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amountToCharge * 100),
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    // Save everything needed to create the order later on the server
    // (by the verify route, or by the webhook if the browser closes)
    const admin = createAdminClient();
    const { error: saveError } = await admin.from("pending_checkouts").insert({
      razorpay_order_id: order.id,
      customer_name: c.name,
      customer_mobile: c.mobile,
      customer_email: c.email || null,
      shipping_address: c.address,
      shipping_city: c.city,
      shipping_state: c.state,
      shipping_pin_code: c.pinCode,
      shipping_country: c.country,
      payment_method: isAdvanceForCod ? "cod" : "online",
      advance_paid: isAdvanceForCod ? COD_ADVANCE_AMOUNT : 0,
      items: cleanItems,
      coupon_code: coupon,
    });

    if (saveError) {
      console.error("Could not save pending checkout:", saveError);
      return NextResponse.json(
        { error: "Could not start checkout. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order,
      subtotal: result.out_subtotal,
      discountAmount: result.out_discount_amount,
      deliveryCharge: result.out_delivery_charge,
      totalAmount: result.out_total_amount,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
