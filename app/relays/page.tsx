import { PrismaClient, Prisma } from "@prisma/client";

export default async function RelayListPage({ relays }: {relays: DatabaseResponse }) {
  const prisma = new PrismaClient();
  relays = await prisma.relay.findMany();

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-3xl font-bold underline text-center mt-4">Nostr Relay Explorer</h1>

      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Relays</h2>
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
