import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

// Default package (client's box size). Shiprocket accepts cm and kg.
const DEFAULT_WEIGHT_KG = 0.1;
const DEFAULT_LENGTH_CM = 4;
const DEFAULT_BREADTH_CM = 4;
const DEFAULT_HEIGHT_CM = 2;

async function getShiprocketToken(): Promise<string> {
  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error("Shiprocket login failed: " + (data.message || res.status));
  }
  return data.token;
}

export async function POST(req: NextRequest) {
  // 1. Only logged-in admins
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return NextResponse.json({ error: "Not an admin" }, { status: 403 });
  }

  // 2. Read order from DB (never trust browser data)
  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_mobile, customer_email, shipping_address, shipping_city, shipping_state, shipping_pin_code, shipping_country, total_amount, advance_paid, payment_method, shipment_id, awb_code"
    )
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.awb_code) {
    return NextResponse.json({ error: "Shipment already created for this order" }, { status: 400 });
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, product_price, quantity")
    .eq("order_id", orderId);

  try {
    // 3. Shiprocket login
    const token = await getShiprocketToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // 4. Create order in Shiprocket
    const isCod = order.payment_method === "cod";
    const codAmount = isCod ? Math.max(order.total_amount - order.advance_paid, 0) : 0;

    const createRes = await fetch(`${SHIPROCKET_BASE}/orders/create/adhoc`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        order_id: `AD${order.order_number}`,
        order_date: new Date().toISOString().slice(0, 19).replace("T", " "),
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
        billing_customer_name: order.customer_name,
        billing_last_name: "",
        billing_address: order.shipping_address,
        billing_city: order.shipping_city,
        billing_pincode: order.shipping_pin_code,
        billing_state: order.shipping_state,
        billing_country: order.shipping_country || "India",
        billing_email: order.customer_email || "support@astrodisha.shop",
        billing_phone: order.customer_mobile,
        shipping_is_billing: true,
        order_items: (items || []).map((i) => ({
          name: i.product_name,
          sku: i.product_name.slice(0, 40),
          units: i.quantity,
          selling_price: i.product_price,
        })),
        payment_method: isCod ? "COD" : "Prepaid",
        sub_total: order.total_amount,
        length: DEFAULT_LENGTH_CM,
        breadth: DEFAULT_BREADTH_CM,
        height: DEFAULT_HEIGHT_CM,
        weight: DEFAULT_WEIGHT_KG,
        ...(isCod ? { cod_amount: codAmount } : {}),
      }),
    });

    const created = await createRes.json();
    if (!createRes.ok || !created.shipment_id) {
      throw new Error("Shiprocket order create failed: " + JSON.stringify(created));
    }

    // 5. Assign courier (AWB). Shiprocket picks the cheapest courier by default.
    const awbRes = await fetch(`${SHIPROCKET_BASE}/courier/assign/awb`, {
      method: "POST",
      headers,
      body: JSON.stringify({ shipment_id: created.shipment_id }),
    });
    const awbData = await awbRes.json();
    const awb = awbData?.response?.data;

    if (!awbRes.ok || !awb?.awb_code) {
      throw new Error("AWB assign failed: " + JSON.stringify(awbData));
    }

    // 6. Save to DB (admin client so the update is not blocked by RLS edge cases)
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: saveError } = await admin
      .from("orders")
      .update({
        shipment_id: String(created.shipment_id),
        awb_code: awb.awb_code,
        courier_name: awb.courier_name || null,
        tracking_url: `https://shiprocket.co/tracking/${awb.awb_code}`,
      })
      .eq("id", orderId);

    if (saveError) {
      throw new Error("Saved to Shiprocket but DB update failed: " + saveError.message);
    }

    return NextResponse.json({
      ok: true,
      awb_code: awb.awb_code,
      courier_name: awb.courier_name || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
