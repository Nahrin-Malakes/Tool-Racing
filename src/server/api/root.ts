import { createTRPCRouter } from "@/server/api/trpc";
import {
  ownerRouter,
  ticketRouter,
  vehicleRouter,
  vehiclesDBRouter,
  adminRouter,
} from "@/server/api/routers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  owner: ownerRouter,
  ticket: ticketRouter,
  vehicle: vehicleRouter,
  vehiclesDB: vehiclesDBRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

