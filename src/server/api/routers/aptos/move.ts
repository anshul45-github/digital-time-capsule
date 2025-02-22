// General Move module interactions (e.g., governance functions)

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const moveRouter = createTRPCRouter({})