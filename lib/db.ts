import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances in dev (Next.js hot reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ------------------------------
// Types returned to the UI layer
// ------------------------------

export type ArtworkCardDTO = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  period: string | null;
  medium: string | null;
  thumbUrl: string | null;
  isForSale: boolean;
  lastSalePrice: number | null;
  popularityScore: number;
  artist: { id: string; slug: string; name: string };
};

export type DiscoveryFilters = {
  period?: string;
  medium?: string;
  forSaleOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  cursor?: string;
  take?: number;
};

const ARTWORK_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  year: true,
  period: true,
  medium: true,
  thumbUrl: true,
  isForSale: true,
  lastSalePrice: true,
  popularityScore: true,
  artist: { select: { id: true, slug: true, name: true } },
} as const;

// ------------------------------
// Discovery feed
// ------------------------------

export async function getDiscoveryFeed(filters: DiscoveryFilters = {}) {
  const { period, medium, forSaleOnly, minPrice, maxPrice, cursor, take = 24 } = filters;

  const where = {
    ...(period ? { period } : {}),
    ...(medium ? { medium } : {}),
    ...(forSaleOnly ? { isForSale: true } : {}),
    ...(minPrice || maxPrice
      ? {
          lastSalePrice: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
        }
      : {}),
  };

  const artworks = await prisma.artwork.findMany({
    where,
    select: ARTWORK_CARD_SELECT,
    orderBy: [{ popularityScore: "desc" }, { createdAt: "desc" }],
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = artworks.length > take;
  const items = hasMore ? artworks.slice(0, take) : artworks;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor };
}

// ------------------------------
// Artist profile
// ------------------------------

export async function getArtistProfile(slug: string) {
  return prisma.artist.findUnique({
    where: { slug },
    include: {
      artworks: {
        select: ARTWORK_CARD_SELECT,
        orderBy: { popularityScore: "desc" },
      },
    },
  });
}

// ------------------------------
// Artwork detail
// ------------------------------

export async function getArtworkDetail(slug: string) {
  return prisma.artwork.findUnique({
    where: { slug },
    include: {
      artist: true,
      priceHistory: { orderBy: { soldAt: "desc" }, take: 20 },
      auctions: { orderBy: { startsAt: "desc" }, take: 5 },
    },
  });
}

// ------------------------------
// Collections
// ------------------------------

export async function getUserCollections(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    include: {
      items: {
        include: { artwork: { select: ARTWORK_CARD_SELECT } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCollectionById(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      items: {
        include: { artwork: { select: ARTWORK_CARD_SELECT } },
        orderBy: { addedAt: "desc" },
      },
    },
  });
}

// ------------------------------
// Favorites
// ------------------------------

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { artwork: { select: ARTWORK_CARD_SELECT } },
    orderBy: { createdAt: "desc" },
  });
}

export async function isArtworkFavorited(userId: string, artworkId: string) {
  const fav = await prisma.favorite.findUnique({
    where: { userId_artworkId: { userId, artworkId } },
  });
  return !!fav;
}

// ------------------------------
// Analytics / instrumentation
// ------------------------------

export async function logEvent(params: {
  userId?: string;
  type: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.event.create({ data: params });
}

export async function recordArtworkView(artworkId: string, userId?: string) {
  await prisma.$transaction([
    prisma.artworkView.create({ data: { artworkId, userId } }),
    prisma.artwork.update({
      where: { id: artworkId },
      data: { viewCount: { increment: 1 } },
    }),
  ]);
}
