import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const relays = await prisma.relay.findMany({
      orderBy: {
        registered_at: 'asc'
      }
    });

    return NextResponse.json(relays)
  }
