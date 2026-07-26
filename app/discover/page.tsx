import { Suspense } from "react";
import Link from "next/link";
import { getDiscoveryFeed } from "@/lib/db";
import ArtworkCard from "@/components/ArtworkCard";

export const metadata = {
  title: "Discover | ArtPeriod",
  description: "Browse artworks by period, medium, and price. Track what matters.",
};

type SearchParams = {
  period?: string;
  medium?: string;
  forSale?: string;
  minPrice?: string;
  maxPrice?: string;
  cursor?: string;
};

const PERIODS = ["Renaissance", "Baroque", "Impressionism", "Modern", "Contemporary"];
const MEDIUMS = ["Oil", "Acrylic", "Sculpture", "Photography", "Mixed Media"];

function FilterBar({ searchParams }: { searchParams: SearchParams }) {
  const buildHref = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("cursor");
    return `/discover?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {PERIODS.map((p) => (
        <Link
          key={p}
          href={buildHref("period", p)}
          className={`px-3 py-1.5 rounded-full text-xs border ${
            searchParams.period === p
              ? "bg-white text-black border-white"
              : "border-neutral-700 text-neutral-300 hover:border-neutral-400"
          }`}
        >
          {p}
        </Link>
      ))}
      {MEDIUMS.map((m) => (
        <Link
          key={m}
          href={buildHref("medium", m)}
          className={`px-3 py-1.5 rounded-full text-xs border ${
            searchParams.medium === m
              ? "bg-white text-black border-white"
              : "border-neutral-700 text-neutral-300 hover:border-neutral-400"
          }`}
        >
          {m}
        </Link>
      ))}
      <Link
        href={buildHref("forSale", "true")}
        className={`px-3 py-1.5 rounded-full text-xs border ${
          searchParams.forSale === "true"
            ? "bg-emerald-500 text-black border-emerald-500"
            : "border-neutral-700 text-neutral-300 hover:border-neutral-400"
        }`}
      >
        For sale only
      </Link>
    </div>
  );
}

async function FeedGrid({ searchParams }: { searchParams: SearchParams }) {
  const { items, nextCursor } = await getDiscoveryFeed({
    period: searchParams.period,
    medium: searchParams.medium,
    forSaleOnly: searchParams.forSale === "true",
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    cursor: searchParams.cursor,
  });

  if (items.length === 0) {
    return (
      <div className="text-center text-neutral-500 py-24">
        No artworks match these filters yet.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((artwork, i) => (
          <ArtworkCard key={artwork.id} artwork={artwork} priority={i < 4} />
        ))}
      </div>
      {nextCursor && (
        <div className="flex justify-center mt-12">
          <Link
            href={`/discover?${new URLSearchParams({
              ...searchParams,
              cursor: nextCursor,
            } as Record<string, string>).toString()}`}
            className="px-6 py-2.5 border border-neutral-700 rounded-full text-sm hover:border-neutral-400"
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-neutral-900 rounded-lg" />
          <div className="mt-3 h-3 w-3/4 bg-neutral-900 rounded" />
          <div className="mt-2 h-3 w-1/2 bg-neutral-900 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function DiscoverPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Discover
        </h1>
        <p className="text-neutral-400 mb-8">
          Browse artworks by period, medium, and price.
        </p>
        <FilterBar searchParams={searchParams} />
        <Suspense fallback={<FeedSkeleton />}>
          {/* @ts-expect-error Async Server Component */}
          <FeedGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
