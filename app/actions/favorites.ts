"use server";

import { revalidatePath } from "next/cache";
import { prisma, logEvent } from "@/lib/db";

// Server actions for favoriting/unfavoriting artworks.
// Auth note: replace `requireUserId()` with your real session lookup
// once auth is wired up (NextAuth, Clerk, etc).
async function requireUserId(): Promise<string> {
  // TODO: wire up real auth session here.
  throw new Error("Not authenticated");
}

export async function toggleFavorite(artworkId: string) {
  const userId = await requireUserId();

  const existing = await prisma.favorite.findUnique({
    where: { userId_artworkId: { userId, artworkId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    await logEvent({ userId, type: "unfavorite", entityType: "artwork", entityId: artworkId });
  } else {
    await prisma.favorite.create({ data: { userId, artworkId } });
    await logEvent({ userId, type: "favorite", entityType: "artwork", entityId: artworkId });
  }

  revalidatePath("/discover");
  revalidatePath("/favorites");

  return { favorited: !existing };
}
