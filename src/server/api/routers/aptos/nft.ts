// NFT operations (minting, transferring time capsule NFTs)

import { z } from "zod";
import { Aptos, AptosConfig, MoveOption, MoveVector, Network } from "@aptos-labs/ts-sdk";
import type { PublicKey, Account, U8, U64 } from "@aptos-labs/ts-sdk";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
  EntryFunctionArgumentTypes,
  SimpleEntryFunctionArgumentTypes,
} from "@aptos-labs/ts-sdk";

// Define the contract address
const CONTRACT_ADDRESS =
  process.env.CONTRACT_ADDRESS ?? "0xYourDeployedContractAddress";

// Setup the client
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

export const nftRouter = createTRPCRouter({
  createCapsule: publicProcedure
    .input(
      z.object({
        walletAccount: z.custom<Account>(),
        walletAddress: z.string(),
        walletPrivateKey: z.custom<PublicKey>(),
        mediaPointer: z.string(), // Expect a string (CID) that you'll convert to bytes.
        mediaType: z.enum(["Image", "Text", "Video", "Audio"]),
        caption: z.string(),
        tags: z.array(z.string()),
        finalUnlockDate: z.number(),
        earlyUnlockConditions: z.array(
          z.object({
            unlockDate: z.number(),
            requiredPayment: z.number(),
          }),
        ),
        locationRegion: z.string(),
        isPublic: z.boolean(),
        openThreshold: z.number().optional(),
        memoryGuardian: z.string().optional(), // Address as string
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Convert strings to bytes as needed (using a helper, e.g., converting to Uint8Array).
      function toBytes(s: string): number[] {
        return Array.from(new TextEncoder().encode(s));
      }

      // Build arguments for the entry function call.
      const args: (
        | EntryFunctionArgumentTypes
        | SimpleEntryFunctionArgumentTypes
      )[] = [
        //creator
        toBytes(input.mediaPointer),
        input.mediaType === "Image"
          ? 0
          : input.mediaType === "Text"
            ? 1
            : input.mediaType === "Video"
              ? 2
              : 3,

        input.caption,
        input.tags,
        input.finalUnlockDate,
        input.earlyUnlockConditions.map((condition) => condition.unlockDate),
        input.earlyUnlockConditions.map(
          (condition) => condition.requiredPayment,
        ),
        toBytes(input.locationRegion),
        input.isPublic,
        input.openThreshold ?? new MoveOption<U64>(),
        input.memoryGuardian ? toBytes(input.memoryGuardian) : new MoveOption<MoveVector<U8>>(),
      ];

      const txn = aptos.transaction.build.simple({
        sender: input.walletAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::time_capsule::create_capsule`,
          functionArguments: args,
        },
      });

      const [userTransactionResponse] = await aptos.transaction.simulate.simple(
        {
          signerPublicKey: input.walletPrivateKey,
          transaction: await txn,
        },
      );

      const senderAuthenticator = aptos.transaction.sign({
        signer: input.walletAccount,
        transaction: await txn,
      });

      const committedTransaction = await aptos.transaction.submit.simple({
        transaction: await txn,
        senderAuthenticator,
      });

      const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
      });

      return { executedTransaction };
    }),
});
