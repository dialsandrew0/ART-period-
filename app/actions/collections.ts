"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma, logEvent } from "@/lib/db";

// TODO: replace with real session lookup once auth is wired up.
async function requireUserId(): Promise<string> {
  throw new Error("Not authenticated");
}

const createCollectionSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional(),
});

export async function createCollection(formData: FormData) {
  const userId = await requireUserId();
  const parsed = createCollectionSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  const collection = await prisma.collection.create({
    data: { userId, ...parsed },
  });

  await logEvent({ userId, type: "collection_created", entityType: "collection", entityId: collection.id });
  revalidatePath("/collections");

  return collection;
}

export async function addArtworkToCollection(collectionId: string, artworkId: string) {
  const userId = await requireUserId();

  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection || collection.userId !== userId) {
    throw new Error("Collection not found");
  }

  await prisma.collectionArtwork.upsert({
    where: { collectionId_artworkId: { collectionId, artworkId } },
    create: { collectionId, artworkId },
    update: {},
  });

  await logEvent({
    userId,
    type: "artwork_added_to_collection",
    entityType: "collection",
    entityId: collectionId,
    metadata: { artworkId },
  });

  revalidatePath(`/collections/${collectionId}`);
}

export async function removeArtworkFromCollection(collectionId: string, artworkId: string) {
  const userId = await requireUserId();

  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection || collection.userId !== userId) {
    throw new Error("Collection not found");
  }

  await prisma.collectionArtwork.deleteMany({ where: { collectionId, artworkId } });
  revalidatePath(`/collections/${collectionId}`);
}

export async function deleteCollection(collectionId: string) {
  const userId = await requireUserId();

  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  if (!collection || collection.userId !== userId) {
    throw new Error("Collection not found");
  }

  await prisma.collectionArtwork.deleteMany({ where: { collectionId } });
  await prisma.collection.delete({ where: { id: collectionId } });

  revalidatePath("/collections");
}
