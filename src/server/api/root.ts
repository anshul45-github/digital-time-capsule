import { postRouter } from "~/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { capsuleRouter } from "./routers/capsule";
import { indexRouter } from "./routers";
import { userRouter } from "./routers/user";
import { nftRouter } from "./routers/aptos/nft";
import { ftRouter } from "./routers/aptos/ft";
import { multiSigRouter } from "./routers/aptos/multisig";
import { moveRouter } from "./routers/aptos/move";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  index: indexRouter,
  user: userRouter,
  capsule: capsuleRouter,
  aptos: createTRPCRouter({
    nft: nftRouter,
    ft: ftRouter,
    multisig: multiSigRouter,
    move: moveRouter,
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
