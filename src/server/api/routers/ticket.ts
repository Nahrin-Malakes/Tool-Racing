import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ticketRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        ownerId: z.string(),
        vehicleId: z.string(),
        diagnostic: z.string(),
        fixed: z.enum(["Yes", "No"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.prisma.owner.findUnique({
        where: {
          id: input.ownerId,
        },
      });
      if (!owner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner does not exists",
          cause: "Owner does not exists",
        });
      }

      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: {
          id: input.vehicleId,
        },
      });
      if (!vehicle) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vehicle does not exists",
          cause: "Vehicle does not exists",
        });
      }

      const ticket = await ctx.prisma.ticket.create({
        data: {
          ownerId: owner.id,
          vehicleId: vehicle.id,
          diagnostic: input.diagnostic,
          fixed: input.fixed == "Yes" ? true : false,
        },
      });

      return { data: ticket };
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

