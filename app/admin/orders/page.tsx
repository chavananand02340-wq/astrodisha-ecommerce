"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_mobile: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pin_code: string;
  subtotal: number;
  delivery_charge: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  advance_paid: number;
  discount_amount: number;
  coupon_code: string | null;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  line_total: number;
};

const ORDER_STATUSES = [
  "Pending Payment",
  "Paid",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <OrdersContent />
    </AdminGuard>
  );
}

function OrdersContent() {
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  async function loadOrders() {
    setLoading(true);

    let query = supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, customer_mobile, customer_email, shipping_address, shipping_city, shipping_state, shipping_pin_code, subtotal, delivery_charge, total_amount, payment_status, order_status, payment_method, advance_paid, discount_amount, coupon_code, created_at"
      );

    if (filterStatus !== "all") {
      query = query.eq("order_status", filterStatus);
    }

    if (filterPaymentMethod !== "all") {
      query = query.eq("payment_method", filterPaymentMethod);
    }

    if (dateFrom) {
      query = query.gte("created_at", new Date(dateFrom).toISOString());
    }

    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      query = query.lte("created_at", end.toISOString());
    }

    if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "amount_high") {
      query = query.order("total_amount", { ascending: false });
    } else if (sortBy === "amount_low") {
      query = query.order("total_amount", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      setStatusMsg("Failed to load orders: " + error.message);
    } else {
      let result = data || [];

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        result = result.filter(
          (o) =>
            o.customer_name.toLowerCase().includes(q) ||
            o.customer_mobile.includes(q) ||
            String(o.order_number).includes(q) ||
            (o.customer_email || "").toLowerCase().includes(q)
        );
      }

      setOrders(result);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterPaymentMethod, sortBy, dateFrom, dateTo]);

  async function toggleExpand(orderId: string) {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }

    setExpandedOrder(orderId);
    setLoadingItems(true);

    const { data, error } = await supabase
      .from("order_items")
      .select("id, product_name, product_price, quantity, line_total")
      .eq("order_id", orderId);

    if (error) {
      setStatusMsg("Failed to load order items: " + error.message);
    } else {
      setOrderItems(data || []);
    }
    setLoadingItems(false);
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: newStatus })
      .eq("id", orderId);

    if (error) {
      setStatusMsg("Failed to update status: " + error.message);
      return;
    }

    loadOrders();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function clearFilters() {
    setFilterStatus("all");
    setFilterPaymentMethod("all");
    setSortBy("newest");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237", marginBottom: "0.5rem" }}>
        Orders & Clients
      </h1>
      <p style={{ color: "#8A607A", marginBottom: "1.5rem" }}>
        {orders.length} order{orders.length !== 1 ? "s" : ""} shown
      </p>

      <div
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search name, mobile, order #, email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadOrders()}
          style={{ ...selectStyle, minWidth: "220px" }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Payment Types</option>
          <option value="online">Online</option>
          <option value="cod">COD</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="amount_high">Amount: High to Low</option>
          <option value="amount_low">Amount: Low to High</option>
        </select>

        <label style={{ fontSize: "0.75rem", color: "#8A607A" }}>
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ ...selectStyle, marginTop: "0.2rem", display: "block" }}
          />
        </label>

        <label style={{ fontSize: "0.75rem", color: "#8A607A" }}>
          To
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ ...selectStyle, marginTop: "0.2rem", display: "block" }}
          />
        </label>

        <button
          onClick={loadOrders}
          style={{
            backgroundColor: "#5A3150",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Search
        </button>

        <button
          onClick={clearFilters}
          style={{
            backgroundColor: "transparent",
            color: "#8A607A",
            border: "1px solid #D9CEC1",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {statusMsg && (
        <p style={{ color: "#B00020", fontWeight: "bold", marginBottom: "1rem" }}>{statusMsg}</p>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders match these filters.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {orders.map((order) => {
            const dueOnDelivery = order.total_amount - order.advance_paid;
            return (
              <div
                key={order.id}
                style={{
                  border: "1px solid #D9CEC1",
                  borderRadius: "8px",
                  padding: "1rem",
                  backgroundColor: "#FBF8F2",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold", color: "#3E2237" }}>
                      AD{order.order_number} — {order.customer_name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#8A607A" }}>
                      {order.customer_mobile}
                      {order.customer_email ? ` • ${order.customer_email}` : ""}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#8A607A" }}>
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", color: "#3E2237" }}>
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </div>
                    {order.coupon_code && (
                      <div style={{ fontSize: "0.7rem", color: "#C6A15B" }}>
                        Coupon: {order.coupon_code} (−₹{order.discount_amount})
                      </div>
                    )}
                    {order.payment_method === "cod" ? (
                      <div style={{ fontSize: "0.75rem", color: "#C6A15B", fontWeight: "bold" }}>
                        COD — ₹{order.advance_paid} paid, ₹{dueOnDelivery} due
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.75rem", color: "#5A3150", fontWeight: "bold" }}>
                        Online — {order.payment_status}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <select
                    value={order.order_status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    style={{
                      padding: "0.4rem 0.6rem",
                      borderRadius: "4px",
                      border: "1px solid #D9CEC1",
                      backgroundColor: "#fff",
                      fontSize: "0.85rem",
                    }}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => toggleExpand(order.id)}
                    style={{
                      backgroundColor: "#8A607A",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    {expandedOrder === order.id ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {expandedOrder === order.id && (
                  <div
                    style={{
                      marginTop: "1rem",
                      borderTop: "1px solid #D9CEC1",
                      paddingTop: "1rem",
                      fontSize: "0.85rem",
                      color: "#3E2237",
                    }}
                  >
                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>Shipping:</strong> {order.shipping_address}, {order.shipping_city},{" "}
                      {order.shipping_state} - {order.shipping_pin_code}
                    </p>

                    <p style={{ marginBottom: "0.5rem" }}>
                      <strong>Subtotal:</strong> ₹{order.subtotal}
                      {order.discount_amount > 0 && (
                        <> &nbsp;|&nbsp; <strong>Discount:</strong> −₹{order.discount_amount}</>
                      )}
                      &nbsp;|&nbsp; <strong>Delivery:</strong> ₹{order.delivery_charge} &nbsp;|&nbsp;{" "}
                      <strong>Total:</strong> ₹{order.total_amount}
                    </p>

                    <p style={{ fontWeight: "bold", marginBottom: "0.4rem", marginTop: "0.75rem" }}>
                      Items:
                    </p>

                    {loadingItems ? (
                      <p>Loading items...</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                        {orderItems.map((item) => (
                          <div
                            key={item.id}
                            style={{ display: "flex", justifyContent: "space-between" }}
                          >
                            <span>
                              {item.product_name} × {item.quantity}
                            </span>
                            <span>₹{item.line_total}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  padding: "0.5rem 0.6rem",
  borderRadius: "4px",
  border: "1px solid #D9CEC1",
  backgroundColor: "#fff",
  fontSize: "0.8rem",
};
