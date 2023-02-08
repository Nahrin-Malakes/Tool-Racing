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
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!vehicle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vehicle does not exists",
          cause: "Vehicle does not exists",
        });
      }

      await ctx.prisma.vehicle.delete({
        where: {
          id: input.id,
        },
      });

      return { data: "Vehicle was removed successfully" };
    }),
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!vehicle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vehicle does not exists",
          cause: "Vehicle does not exists",
        });
      }

      return { data: vehicle };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const vehicles = await ctx.prisma.vehicle.findMany();

    return { data: vehicles };
  }),
  getAllInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const vehiclesCount = await ctx.prisma.vehicle.count();
      const vehicles = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (vehicles.length > limit) {
        const nextItem = vehicles.pop();
        nextCursor = nextItem && nextItem.id;
      }

      return { vehicles, nextCursor, vehiclesCount };
    }),
  edit: protectedProcedure
    .input(z.object({ year: z.string(), model: z.string(), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!vehicle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vehicle does not exists.",
          cause: "Vehicle does not exists.",
        });
      }

      await ctx.prisma.vehicle.update({
        where: {
          id: vehicle.id,
        },
        data: {
          year: input.year,
          model: input.model,
        },
      });

      return {};
    }),
});

