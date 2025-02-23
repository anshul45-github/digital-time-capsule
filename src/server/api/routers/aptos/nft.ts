// NFT operations (minting, transferring time capsule NFTs)

import { z } from "zod";
import {
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";
import type { Account} from "@aptos-labs/ts-sdk";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type {
  EntryFunctionArgumentTypes,
  SimpleEntryFunctionArgumentTypes,
} from "@aptos-labs/ts-sdk";
import { TRPCError } from "@trpc/server";

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
        mediaPointer: z.string(), // Expect a string (CID) that you'll convert to bytes.
        caption: z.string(),
        newCollection: z.boolean(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Build arguments for the entry function call.
      const args: (
        | EntryFunctionArgumentTypes
        | SimpleEntryFunctionArgumentTypes
      )[] = [
        input.walletAccount.accountAddress,
        input.mediaPointer,
        input.caption,
        input.newCollection,
      ];

      const txn = aptos.transaction.build.simple({
        sender: input.walletAccount.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::time_capsule::create_capsule`,
          functionArguments: args,
        },
      });

      const [userTransactionResponse] = await aptos.transaction.simulate.simple(
        {
          signerPublicKey: input.walletAccount.publicKey,
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

      if (input.newCollection){
        await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          collectionOnChain: true,
        }
      })
    }


      const event_handle = `${CONTRACT_ADDRESS}::time_capsule::CapsuleCreatedEvent`;
      const field_name = "created_events";

      const txDetailsResponse = await fetch(
        `https://api.devnet.aptoslabs.com/v1/accounts/${CONTRACT_ADDRESS}/events/${event_handle}/${field_name}`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const txDetails = await txDetailsResponse.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      if (!txDetails) {
        throw new TRPCError({
          message: "CapsuleCreatedEvent not found in transaction events.",
          code: "INTERNAL_SERVER_ERROR",
          cause: executedTransaction,
        });
      }

      return {
        txnHash: executedTransaction.hash,
        txnStatus: executedTransaction.success,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        tokenId: txDetails.data.token_data_id,
      };
    }),

  acceptGuardianInvite: publicProcedure
    .input(
      z.object({
        capsuleId: z.string(),
        guardianWalletAddress: z.string(),
        creatorWallet: z.custom<Account>(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const capsule = await ctx.db.capsule.findUnique({
        where: { id: input.capsuleId },
      });
      if (!capsule?.transferable) {
        throw Error("Trying to migrate a non transferrable capsule");
      }

      //important to note that money cuts from the invite acceptee's account
      const txn = aptos.transaction.build.simple({
        sender: input.creatorWallet.accountAddress,
        data: {
          function: `${CONTRACT_ADDRESS}::time_capsule::transfer_to_memory_guardian`,
          functionArguments: [
            capsule?.nftId,
            input.guardianWalletAddress,
          ],
        },
      });

      const [userTransactionResponse] = await aptos.transaction.simulate.simple(
        {
          signerPublicKey: input.creatorWallet.publicKey,
          transaction: await txn,
        },
      );

      const senderAuthenticator = aptos.transaction.sign({
        signer: input.creatorWallet,
        transaction: await txn,
      });

      const committedTransaction = await aptos.transaction.submit.simple({
        transaction: await txn,
        senderAuthenticator,
      });

      try {
        const executedTransaction = await aptos.waitForTransaction({
          transactionHash: committedTransaction.hash,
        });
        if (capsule.memoryGuardianId) {
          return await ctx.db.capsule.update({
            where: {
              id: input.capsuleId,
            },
            data: {
              memoryGuardian: {
                disconnect: true,
              },
              creator: { connect: { id: capsule.memoryGuardianId } },
              transactionHash: executedTransaction.hash,
              transactionStatus: executedTransaction.success,
              transferable: false,
            },
          });
        }
        else{
          return capsule;
        }
      } catch (err) {
        throw new TRPCError({
          message: "Error while accepting guardian invite",
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
        });
      }

    }),
});
