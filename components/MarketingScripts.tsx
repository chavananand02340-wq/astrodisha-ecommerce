import Script from "next/script";
import { createClient } from "@/utils/supabase/server";

export default async function MarketingScripts() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value")
    .in("setting_key", ["ga_measurement_id", "meta_pixel_id"]);

  const map = Object.fromEntries((data || []).map((r) => [r.setting_key, (r.setting_value || "").trim()]));
  const gaId = map["ga_measurement_id"] || "";
  const pixelId = map["meta_pixel_id"] || "";

  return (
    <>
      {gaId && /^G-[A-Z0-9]+$/i.test(gaId) && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {pixelId && /^\d+$/.test(pixelId) && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
