import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const ownerRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        mobile: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const isOwnerAlreadyExists = await ctx.prisma.owner.findUnique({
        where: {
          mobile: input.mobile,
        },
      });
      if (isOwnerAlreadyExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner already exists",
          cause: "Owner already exists",
        });
      }

      const owner = await ctx.prisma.owner.create({
        data: {
          mobile: input.mobile,
          name: input.name,
        },
      });

      return { data: owner };
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
          message: "Owner does not exists.",
          cause: "Owner does not exists.",
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

      const ownersCount = await ctx.prisma.owner.count();
      const owners = await ctx.prisma.owner.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (owners.length > limit) {
        const nextItem = owners.pop();
        nextCursor = nextItem && nextItem.id;
      }

      return { owners, nextCursor, ownersCount };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const owners = await ctx.prisma.owner.findMany();

    return { owners };
  }),
  edit: protectedProcedure
    .input(z.object({ name: z.string(), mobile: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.prisma.owner.findUnique({
        where: {
          mobile: input.mobile,
        },
      });
      if (!owner) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Owner does not exists.",
          cause: "Owner does not exists.",
        });
      }

      await ctx.prisma.owner.update({
        where: {
          id: owner.id,
        },
        data: {
          name: input.name,
          mobile: input.mobile,
        },
      });

      return {};
    }),
});
