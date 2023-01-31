import { createTRPCRouter } from "./trpc";
import { ownerRouter } from "./routers/owner";
import { vehicleRouter } from "./routers/vehicle";
import { ticketRouter } from "./routers/ticket";
import { vehiclesDBRouter } from "./routers/vehiclesdb";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;

