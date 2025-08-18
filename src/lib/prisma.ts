import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

const prisma = global.prisma ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
