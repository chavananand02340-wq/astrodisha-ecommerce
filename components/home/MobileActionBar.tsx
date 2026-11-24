"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "../ui/Icon";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

/** Phone-only bottom bar (Shop Now + WhatsApp). Slides in once the hero is scrolled past. */
export default function MobileActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-all duration-500 ease-[var(--ease-astro)] md:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <div className="flex gap-2 rounded-full border border-white/10 bg-[#160828]/92 p-1.5 shadow-[0_14px_40px_rgba(22,8,40,0.4)] backdrop-blur-md">
        <Link
          href="/shop"
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/15 text-[14px] font-semibold text-[#f4effb]"
        >
          <Icon name="sparkle" className="h-4 w-4 text-[#e3c27e]" />
          Shop Now
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] text-[14px] font-semibold text-[#06290f]"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
            <path d={WHATSAPP_ICON_PATH} />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
