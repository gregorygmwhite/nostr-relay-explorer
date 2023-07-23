import { PrismaClient, Relay } from "@prisma/client";
import { Relay as RelayProp} from "@/types/relay";
import Link from 'next/link';
import urls from '@/config/urls';
import RelaysList from "@/components/relays";

export default function RelayListPage({ relays }: {relays: RelayProp[] }) {
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
        <RelaysList relays={relays} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const relays = await prisma.relay.findMany();

  const serializedRelays = relays.map((relay: Relay) => ({
    ...relay,
    registered_at: relay.registered_at.toISOString(),
  }));

  return {
    props: { relays: serializedRelays },
  }
}
