// NFT operations (minting, transferring time capsule NFTs)

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const nftRouter = createTRPCRouter({})