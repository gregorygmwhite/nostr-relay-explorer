import { PrismaClient, Prisma } from "@prisma/client";
import Link from 'next/link';
import urls from '@/config/urls';

export default async function RelayListPage({ relays }: {relays: DatabaseResponse }) {
  const prisma = new PrismaClient();
  relays = await prisma.relay.findMany();

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold mt-4">Relays</h1>
          <Link
            href={urls.pages.createRelay}
            className="nline-block px-6 py-3 text-xs font-medium leading-6 text-center text-white uppercase transition bg-blue-700 rounded shadow ripple hover:shadow-lg hover:bg-blue-800 focus:outline-none"
            >
              Create Relay
          </Link>
        </div>
      </div>
      <div className="mt-4">
        {relays.map((relay: Prisma.Relay) => (
          <div key={relay.id} className="border p-4 mt-2 rounded-md">
            <h3 className="font-bold text-xl">{relay.name}</h3>
            <p>URL: {relay.url}</p>
            <p>Registered At: {new Date(relay.registeredAt).toLocaleString()}</p>
            <pre className="p-2 mt-2"><code>{JSON.stringify(relay.metadata, null, 2)}</code></pre>
          </div>
        ))}
      </div>
    </div>
  );
}

type DatabaseResponse = {
  rows: Prisma.Relay[]
}
