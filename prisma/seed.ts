import { PrismaClient } from '@prisma/client'
import { DateTime } from "luxon";

const prisma = new PrismaClient()

async function main() {

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.io' },
    update: {},
    create: {
      email: 'admin@example.io',
      name: 'Admin',
    },
  })

  const yesterday = DateTime.now().minus({ days: 1 }).toJSDate();

  const damus = await prisma.relay.upsert({
    where: { url: 'wss://relay.damus.io' },
    update: {},
    create: {
      url: 'wss://relay.damus.io',
      name: 'Damus',
      metadata: {},
      registeredAt: yesterday,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })

  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
