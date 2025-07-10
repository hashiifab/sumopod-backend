import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
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
    plugins: [bearer()],
    baseURL: process.env.BETTER_AUTH_URL || "https://sumopod-backend.fly.dev",
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') || ["https://cloone-sumopod.netlify.app"],
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
