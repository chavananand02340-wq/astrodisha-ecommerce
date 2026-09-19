import { createClient } from "@/utils/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("id");

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
          background: "#F7F3EC",
          color: "#3E2237",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
          Supabase Connection Test
        </h1>

        <div
          style={{
            padding: "20px",
            borderRadius: "16px",
            background: "#fffdf9",
            border: "1px solid #d9cec1",
          }}
        >
          <h2 style={{ color: "#a33" }}>❌ Connection / Query Error</h2>

          <p>
            Supabase se products table read nahi ho pa rahi.
          </p>

          <p>
            Error: {error.message}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#F7F3EC",
        color: "#3E2237",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "16px" }}>
        Supabase Connection Test
      </h1>

      <div
        style={{
          padding: "24px",
          borderRadius: "16px",
          background: "#fffdf9",
          border: "1px solid #d9cec1",
        }}
      >
        <h2 style={{ color: "#5A3150", marginBottom: "12px" }}>
          ✅ Supabase Connected
        </h2>

        <p>
          The website successfully connected to the Supabase
          <strong> products </strong>
          table.
        </p>

        <p style={{ marginTop: "16px" }}>
          Products found: <strong>{data?.length ?? 0}</strong>
        </p>

        {(data?.length ?? 0) === 0 && (
          <p style={{ marginTop: "12px" }}>
            The table is currently empty. This is expected because
            products have not been added yet.
          </p>
        )}
      </div>
    </main>
  );
}
