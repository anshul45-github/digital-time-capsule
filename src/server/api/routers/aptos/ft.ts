// Fungible token operations (gamification coins, badges, points)

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ftRouter = createTRPCRouter({})
