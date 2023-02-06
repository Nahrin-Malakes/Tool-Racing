import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const vehicleRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        model: z.string(),
        year: z.string(),
        ownerMobile: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.prisma.owner.findUnique({
        where: {
          mobile: input.ownerMobile,
        },
      });
      if (!owner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner does not exists",
          cause: "Owner does not exists",
        });
      }

      const vehicle = await ctx.prisma.vehicle.create({
        data: {
          model: input.model,
          year: input.year,
        },
      });

      return { data: vehicle };
    }),
  remove: protectedProcedure
    .input(
      z.object({
        mobile: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.prisma.owner.findUnique({
        where: {
          mobile: input.mobile,
        },
      });
      if (!owner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner does not exists",
          cause: "Owner does not exists",
        });
      }

      await ctx.prisma.owner.delete({
        where: {
          mobile: input.mobile,
        },
      });

      return { data: "Owner was removed successfully" };
    }),
  getByMobile: protectedProcedure
    .input(
      z.object({
        mobile: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const owner = await ctx.prisma.owner.findUnique({
        where: {
          mobile: input.mobile,
        },
      });
      if (!owner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner does not exists",
          cause: "Owner does not exists",
        });
      }

      return { data: owner };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const vehicles = await ctx.prisma.vehicle.findMany();

    return { data: vehicles };
  }),
});

