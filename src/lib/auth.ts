import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { bearer } from "better-auth/plugins";

const prisma = new PrismaClient({
  log: ["warn", "error"],
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [jwt(), bearer()],
  baseURL: "http://localhost:3000",
  trustedOrigins: ["http://localhost:3001"],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.balance.create({
            data: {
              userId: user.id,
              userBalance: 0,
            },
          });
        },
      },
    },
  },
});

export { prisma };
