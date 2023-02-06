import { z } from "zod";

import { env } from "@/env/server.mjs";
import type { Motorcycle } from "@/types/motorcycle.js";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const vehiclesDBRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        make: z.string(),
        model: z.string(),
        year: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/motorcycles?make=${input.make}&model=${input.model}&year=${input.year}&offset=0`,
        {
          headers: {
            "X-Api-Key": env.MOTORCYCLES_API_KEY,
          },
        }
      );
      const data: Motorcycle[] = (await res.json()) as Motorcycle[];
      return data;
    }),
});

