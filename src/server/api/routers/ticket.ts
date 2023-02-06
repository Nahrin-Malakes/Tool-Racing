import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
  getActive: protectedProcedure.query(async ({ ctx }) => {
    const tickets = await ctx.prisma.ticket.findMany({
      where: {
        fixed: false,
      },
      include: {
        owner: true,
        vehicle: true,
      },
    });
    const activeTicketsCount = await ctx.prisma.ticket.count({
      where: {
        fixed: false,
      },
    });

    return { data: tickets, count: activeTicketsCount };
  }),
  setFixed: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.ticket.update({
        where: {
          id: input.ticketId,
        },
        data: {
          fixed: true,
        },
      });

      return { data: "Ticket has been set as fixed and archived" };
    }),

  fixedToday: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const tickets = await ctx.prisma.ticket.count({
      where: {
        fixed: true,
        AND: {
          updatedAt: {
            gte: new Date(
              Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
            ),
            lte: new Date(
              Date.UTC(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1
              )
            ),
          },
        },
      },
    });

    return { data: tickets };
  }),
  newTickets: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();

    const tickets = await ctx.prisma.ticket.count({
      where: {
        AND: {
          createdAt: {
            gte: new Date(
              Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
            ),
            lte: new Date(
              Date.UTC(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1
              )
            ),
          },
        },
      },
    });

    return { data: tickets };
  }),
});

