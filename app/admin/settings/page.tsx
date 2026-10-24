"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

const MARKETING_KEYS = ["ga_measurement_id", "meta_pixel_id"] as const;

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <SettingsContent />
    </AdminGuard>
  );
}

function SettingsContent() {
  const supabase = createClient();

  const [gaId, setGaId] = useState("");
  const [pixelId, setPixelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState<{ ga?: string; pixel?: string }>({});

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSettings() {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", [...MARKETING_KEYS]);

    if (error) {
      setMsg("Failed to load settings: " + error.message);
    } else {
      const map = Object.fromEntries((data || []).map((r) => [r.setting_key, r.setting_value ?? ""]));
      setGaId(map["ga_measurement_id"] || "");
      setPixelId(map["meta_pixel_id"] || "");
    }
    setLoading(false);
  }

  function validate() {
    const next: { ga?: string; pixel?: string } = {};
    const ga = gaId.trim();
    const px = pixelId.trim();

    if (ga && !/^G-[A-Z0-9]+$/i.test(ga)) {
      next.ga = "GA4 ID should look like G-XXXXXXXXXX (starts with G-).";
    }
    if (px && !/^\d+$/.test(px)) {
      next.pixel = "Meta Pixel ID should contain only numbers.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!validate()) return;

    setSaving(true);

    const updates = [
      { setting_key: "ga_measurement_id", setting_value: gaId.trim() },
      { setting_key: "meta_pixel_id", setting_value: pixelId.trim() },
    ];

    const results = await Promise.all(
      updates.map((u) =>
        supabase
          .from("site_settings")
          .update({ setting_value: u.setting_value, updated_at: new Date().toISOString() })
          .eq("setting_key", u.setting_key)
          .select("setting_key")
      )
    );

    setSaving(false);

    const failed = results.find((r) => r.error);
    if (failed?.error) {
      setMsg("Failed to save: " + failed.error.message);
      return;
    }

    const notUpdated = results.some((r) => !r.data || r.data.length === 0);
    if (notUpdated) {
      setMsg("Save did not apply. Check that the setting rows exist in site_settings.");
      return;
    }

    setMsg("Saved. Tracking will load on the next page visit.");
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "640px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>Settings</h1>

      <div
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "0.5rem" }}>Marketing tracking</h2>
        <p style={{ fontSize: "0.8rem", color: "#8A607A", marginBottom: "1rem" }}>
          Leave empty to turn tracking off. These IDs are public (they appear in the page source), so they are safe to show here.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSave}>
            <label style={labelStyle}>Google Analytics 4 Measurement ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              style={inputStyle}
            />
            {errors.ga && <p style={errorStyle}>{errors.ga}</p>}

            <label style={labelStyle}>Meta Pixel ID</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234567890"
              value={pixelId}
              onChange={(e) => setPixelId(e.target.value)}
              style={inputStyle}
            />
            {errors.pixel && <p style={errorStyle}>{errors.pixel}</p>}

            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: "#5A3150",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "0.6rem 1.2rem",
                fontWeight: "bold",
                cursor: saving ? "not-allowed" : "pointer",
                marginTop: "0.5rem",
              }}
            >
              {saving ? "Saving..." : "Save settings"}
            </button>
          </form>
        )}

        {msg && <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#3E2237" }}>{msg}</p>}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: "bold",
  color: "#3E2237",
  marginBottom: "0.3rem",
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.6rem",
  marginBottom: "0.75rem",
  border: "1px solid #D9CEC1",
  borderRadius: "4px",
  backgroundColor: "#fff",
};

const errorStyle: React.CSSProperties = {
  color: "#B00020",
  fontSize: "0.75rem",
  marginTop: "-0.5rem",
  marginBottom: "0.75rem",
};
