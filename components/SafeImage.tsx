"use client";

import { useState } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
};

const DEFAULT_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#F7F3EC"/>
      <circle cx="400" cy="340" r="95" fill="#5A3150"/>
      <text x="400" y="500" text-anchor="middle"
        font-family="Georgia, serif"
        font-size="48"
        fill="#3E2237">
        ASTRODISHA
      </text>
      <text x="400" y="545" text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="20"
        letter-spacing="4"
        fill="#8A607A">
        DIVINE ALIGNMENT
      </text>
    </svg>
  `);

export default function SafeImage({
  src,
  alt,
  className = "",
  fallback = DEFAULT_FALLBACK,
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-[#eee5db]" />
      )}

      <img
        src={currentSrc}
        alt={alt}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (currentSrc !== fallback) {
            setCurrentSrc(fallback);
          }
        }}
      />
    </div>
  );
}
