"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

type ArtworkImageProps = {
  src: string | null | undefined;
  alt: string;
  variant?: "thumb" | "card" | "hero" | "zoom";
  className?: string;
  priority?: boolean;
};

const SIZES: Record<string, string> = {
  thumb: "(max-width: 768px) 25vw, 120px",
  card: "(max-width: 768px) 50vw, 320px",
  hero: "100vw",
  zoom: "90vw",
};

const ASPECT: Record<string, string> = {
  thumb: "aspect-square",
  card: "aspect-[4/5]",
  hero: "aspect-[16/9]",
  zoom: "aspect-auto",
};

// Single place to control artwork image rendering: aspect ratio,
// lazy loading, blur placeholder, and fallback state.
export default function ArtworkImage({
  src,
  alt,
  variant = "card",
  className,
  priority = false,
}: ArtworkImageProps) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-lg bg-neutral-900",
        ASPECT[variant],
        className
      )}
    >
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center text-neutral-600 text-sm">
          No image
        </div>
      ) : (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={SIZES[variant]}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  );
}
