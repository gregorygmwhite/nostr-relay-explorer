'use client'

import { Relay } from "@prisma/client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import urls from '@/config/urls';
import RelaysList from "@/components/relays";

async function getRelays() {
  const response = await fetch(urls.apis.relays);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const relaysRaw = response.json();
  debugger
  return relaysRaw;
}

export default function RelayListPage() {

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");


  useEffect(() => {
    async function getRelays() {
      try {
        const response = await fetch(urls.apis.relays);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const relaysRaw = await response.json();
        setRelays(relaysRaw);
      } catch (error: any) {
        console.error(`Failed to fetch relays`, error);
        setRelayFetchError(error.message);
      }
    }

    getRelays();
  }, []);

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

