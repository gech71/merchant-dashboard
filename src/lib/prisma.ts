import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
} & typeof global

const prisma = globalThis.prisma ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
