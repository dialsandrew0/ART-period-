"use client";

import Link from "next/link";
import { useRef } from "react";
import ArtworkImage from "./ArtworkImage";
import { hoverLift } from "@/lib/motion";
import type { ArtworkCardDTO } from "@/lib/db";

type ArtworkCardProps = {
  artwork: ArtworkCardDTO;
  priority?: boolean;
};

function formatPrice(value: number | null) {
  if (!value) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ArtworkCard({ artwork, priority = false }: ArtworkCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleEnter = () => {
    if (ref.current) hoverLift(ref.current).play();
  };
  const handleLeave = () => {
    if (ref.current) hoverLift(ref.current).reverse();
  };

  const price = formatPrice(artwork.lastSalePrice);

  return (
    <Link
      ref={ref}
      href={`/artworks/${artwork.slug}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group block"
    >
      <ArtworkImage
        src={artwork.thumbUrl}
        alt={artwork.title}
        variant="card"
        priority={priority}
      />
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-neutral-100 line-clamp-1">
          {artwork.title}
        </h3>
        <p className="text-xs text-neutral-400 line-clamp-1">
          {artwork.artist.name}
          {artwork.year ? ` · ${artwork.year}` : ""}
        </p>
        <div className="flex items-center justify-between pt-1">
          {price && (
            <span className="text-xs text-neutral-300">{price}</span>
          )}
          {artwork.isForSale && (
            <span className="text-[10px] uppercase tracking-wide text-emerald-400">
              For sale
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
