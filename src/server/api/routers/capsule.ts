import { z } from "zod";
import {
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";
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
        mediaType: z.enum([MediaType.IMAGE, MediaType.TEXT, MediaType.VIDEO, MediaType.AUDIO]),
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
        memoryGuardian: z.string().optional(),
        transactionHash: z.string(),
        eventCreationNum: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
        return await ctx.db.capsule.create({
          data: {
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
            memoryGuardian: input.memoryGuardian,
            transactionHash: input.transactionHash,
            transactionStatus: false,
            eventCreationNum: input.eventCreationNum,
          },
        });
    }),

  viewCapsule: publicProcedure
    .input(z.object({ id: z.string(), locationRegion: z.string() }))
    .query(async ({ input, ctx }) => {
      const capsule = await ctx.db.capsule.findUnique({
        where: { id: input.id },
      });
      if (!capsule) throw new Error("Capsule not found");

      function toBytes(s: string): number[] {
        return Array.from(new TextEncoder().encode(s));
      }

      const payload = {
        function:
          `${CONTRACT_ADDRESS}::time_capsule::get_capsule_media_if_valid_opener` as `${string}::${string}::${string}`,
        functionArguments: [
          parseInt(capsule.nftId),
          capsule.openAttempts,
          toBytes(input.locationRegion),
          Math.round(new Date().getTime() / 1000),
        ],
        typeArguments: ["vector<u8>", "u64", "vector<u8>", "u64"],
      };
      const mediaPointer = await aptos.view({ payload });
      // Use mediaPointer or handle it appropriately
      if (mediaPointer && mediaPointer.length > 0) {
        const byteArray = Uint8Array.from(mediaPointer as number[]);
        const url = new TextDecoder("utf-8").decode(byteArray);
        return url;
      }

      return null;
    }),
});
