import { z } from "zod";
import { auth } from '~/auth';

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure
    .query(async ({ ctx }) => {
      const session = await auth();
      if (!session || !session.user || !session.user.email) {
        return new Error("Unauthorized");
      }
      return await db.user.findUnique({
        where: { email: session.user.email },
      });
    }),
  
    fetchUserCapsules: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db.user.findMany({
        where: {
          id: input.userId,
        },
        select: {
          capsules: true, 
        }
      });
    }),

})