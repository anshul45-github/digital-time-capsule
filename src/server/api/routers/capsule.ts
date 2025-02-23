import { z } from "zod";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { MediaType } from "@prisma/client";

const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS ?? "0xYourDeployedContractAddress";

export const capsuleRouter = createTRPCRouter({
  createCapsule: publicProcedure
    .input(
      z.object({
        creatorId: z.string(),
        nftId: z.string(),
        title: z.string(),
        mediaType: z.enum([
          MediaType.IMAGE,
          MediaType.TEXT,
          MediaType.VIDEO,
          MediaType.AUDIO,
        ]),
        caption: z.string(),
        tags: z.array(z.string()),
        finalUnlockDate: z.date(),
        earlyUnlockDates: z.array(
          z.object({
            unlockDate: z.date(),
            requiredPayment: z.number(),
          }),
        ),
        locationRegion: z.string().optional(),
        isPublic: z.boolean(),
        openThreshold: z.number().optional(),
        memoryGuardianWallet: z.string().optional(),
        memoryGuardianId: z.string().optional(),
        transactionHash: z.string(),
        eventCreationNum: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.capsule.create({
        data: {
          title: input.title,
          creator: { connect: { id: input.creatorId } },
          caption: input.caption,
          tags: input.tags,
          isPublic: input.isPublic,
          nftId: input.nftId,
          finalUnlockDate: input.finalUnlockDate,
          mediaType: input.mediaType,
          openAttempts: 0, // or any default value
          earlyUnlockDates: {
            createMany: {
              data: input.earlyUnlockDates.map((date) => ({
                unlockDate: date.unlockDate,
                requiredPayment: date.requiredPayment,
              })),
            },
          },
          locationRegion: input.locationRegion,
          openThreshold: input.openThreshold,
          memoryGuardian: { connect: { id: input.memoryGuardianId } },
          memoryGuardianWallet: input.memoryGuardianWallet,
          transferable: !!input.memoryGuardianId,
          transactionHash: input.transactionHash,
          transactionStatus: false,
          eventCreationNum: input.eventCreationNum,
        },
        include: {
          creator: true,
          earlyUnlockDates: true,
          memoryGuardian: true,
        },
      });
    }),

  viewCapsule: publicProcedure
    .input(
      z.object({
        capsuleId: z.string(),
        userId: z.string(),
        userLocation: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const capsule = await ctx.db.capsule.findUnique({
        where: { id: input.capsuleId },
        include: {
          creator: true,
          earlyUnlockDates: true,
        },
      });
      if (!capsule) throw new Error("Capsule not found");

      const user = (await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          earlyUnlocks: true,
        },
      })) as { earlyUnlocks: { unlockDate: Date }[] } | null;
      if (!user) throw new Error("User not found");
      user.earlyUnlocks.sort(
        (a, b) => a.unlockDate.getTime() - b.unlockDate.getTime(),
      );

      const payload = {
        function:
          `${CONTRACT_ADDRESS}::time_capsule::get_capsule_media_if_valid_opener` as `${string}::${string}::${string}`,
        functionArguments: [
          capsule.nftId,
          Math.round(capsule.finalUnlockDate.getTime() / 1000),
          capsule.openAttempts,
          capsule.openThreshold ?? undefined,
          capsule.locationRegion ?? undefined,
          input.userLocation,
          Math.round(new Date().getTime() / 1000),
          capsule.earlyUnlockDates.map((date) =>
            Math.round(date.unlockDate.getTime() / 1000),
          ),
          user.earlyUnlocks.length > 0
            ? Math.round(user.earlyUnlocks[0]!.unlockDate.getTime() / 1000)
            : undefined,
        ],
      };
      const mediaPointer = await aptos.view({ payload });
      // Use mediaPointer or handle it appropriately
      if (
        mediaPointer &&
        typeof mediaPointer === "object" &&
        "value" in mediaPointer
      ) {
        return mediaPointer.value as string;
      }
      return "";

    }),
});
