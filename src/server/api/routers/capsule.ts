import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const capsuleRouter = createTRPCRouter({
  createCapsule: publicProcedure
    .input(
      z.object({
        contentHash: z.string(),
        caption: z.string(),
        tags: z.array(z.string()),
        location: z.string().optional(),
        finalUnlockTime: z.date(),
        earlyUnlockDates: z.array(z.date()),
        humanLimit: z.number(),
        guardianId: z.string().optional(),
        badgeRequirement: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.capsule.create({
        data: {
          creatorId: ctx.session?.user.id ?? "anonymous",
          contentHash: input.contentHash,
          caption: input.caption,
          tags: input.tags,
          location: input.location,
          finalUnlockTime: input.finalUnlockTime,
          earlyUnlockDates: input.earlyUnlockDates,
          humanLimit: input.humanLimit,
          openedCount: 0,
          isPublic: false,
          guardianId: input.guardianId,
          badgeRequirement: input.badgeRequirement,
        },
      });
    }),

  // Additional procedures (e.g., unlockCapsule) go here.
});
