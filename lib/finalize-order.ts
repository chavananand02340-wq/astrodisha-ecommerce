import { createAdminClient } from "@/lib/supabase-admin";
import { sendOrderEmails } from "@/lib/order-email";

export type FinalizeStatus = "completed" | "failed" | "not_found";

export type FinalizeResult = {
  status: FinalizeStatus;
  orderNumber: number | null;
  error: string | null;
};

// Creates the order for a paid Razorpay order — exactly once.
// Safe to call from both the verify route and the webhook.
export async function finalizeOrder(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<FinalizeResult> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("finalize_checkout", {
    p_razorpay_order_id: razorpayOrderId,
    p_razorpay_payment_id: razorpayPaymentId,
  });

  if (error) {
    throw new Error("finalize_checkout failed: " + error.message);
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    throw new Error("finalize_checkout returned no result.");
  }

  const status = row.out_status as FinalizeStatus;
  const orderNumber = row.out_order_number != null ? Number(row.out_order_number) : null;

  // Send emails only the first time the order is created (never twice)
  if (status === "completed" && row.out_newly_created && orderNumber) {
    try {
      const { data: checkout } = await supabase
        .from("pending_checkouts")
        .select(
          "customer_name, customer_mobile, customer_email, shipping_address, shipping_city, shipping_state, shipping_pin_code, payment_method, advance_paid, order_id"
        )
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

      let lines: { product_name: string; product_price: number; quantity: number }[] = [];

      if (checkout?.order_id) {
        const { data: itemRows } = await supabase
          .from("order_items")
          .select("product_name, product_price, quantity")
          .eq("order_id", checkout.order_id);
        lines = itemRows || [];
      }

      if (checkout) {
        await sendOrderEmails({
          orderNumber,
          customerName: checkout.customer_name,
          customerEmail: checkout.customer_email,
          customerMobile: checkout.customer_mobile,
          shippingAddress: checkout.shipping_address,
          shippingCity: checkout.shipping_city,
          shippingState: checkout.shipping_state,
          shippingPinCode: checkout.shipping_pin_code,
          subtotal: Number(row.out_subtotal),
          discountAmount: Number(row.out_discount_amount),
          deliveryCharge: Number(row.out_delivery_charge),
          totalAmount: Number(row.out_total_amount),
          paymentMethod: checkout.payment_method,
          advancePaid: Number(checkout.advance_paid),
          items: lines.map((line) => ({
            name: line.product_name,
            price: Number(line.product_price),
            quantity: Number(line.quantity),
          })),
        });
      }
    } catch (emailError) {
      // An email problem must never undo or block a paid order
      console.error("Order emails failed:", emailError);
    }
  }

  return { status, orderNumber, error: row.out_error ?? null };
}
