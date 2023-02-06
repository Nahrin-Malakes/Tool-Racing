import { z } from "zod";
import { createTRPCRouter, protectedAdminProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  getAllSessions: protectedAdminProcedure.query(async ({ ctx }) => {
    const sessions = await ctx.prisma.session.findMany({
      include: {
        user: true,
      },
    });

    return { data: sessions };
  }),
  deleteSessionByEmail: protectedAdminProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.session.deleteMany({
        where: {
          user: {
            email: input.email,
          },
        },
      });

      return {
        data: "Session was delete successfully",
      };
    }),
});

