// File: pages/api/relay.ts

import { PrismaClient, Relay } from "@prisma/client";
import { NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const formData = await request.json()
  let { url, name } = formData;

    // Type-checking for body parameters
    if (typeof url !== 'string' || typeof name !== 'string') {
      return new Response('Invalid data provided', {
        status: 400,
      })
    }

    if (name === "") {
      name = url
    }

    const newRelay: Relay = await prisma.relay.create({
      data: {
        url,
        name,
        registered_at: new Date()
      },
    });

  return NextResponse.json(newRelay)
}
