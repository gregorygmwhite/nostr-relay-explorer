'use client'

import EventsDisplay from "../components/events";
import { NOSTR_KINDS } from "@/config/consts";
import { NostrEvent } from "@/types/event";
import { useState } from "react";
import { relayInit } from 'nostr-tools';

const HomePage = () => {

  const defaultLimit = 100;
  const examplePubkey = "d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027";

  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [relayUrl, setRelayUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [kinds, setKinds] = useState<string[]>([""]);
  const [errorMessage, setErrorMessage] = useState("");


  const handleKindsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
      setKinds(selectedOptions);
  };

  const parseKindsSelection = (kinds: string[]) => {
    if (kinds.includes("")) {
        return [];
    }
    return kinds.map(kind => parseInt(kind, 10));
  }


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the form from reloading the page

    // import and initialize the relay
    const relay = relayInit(relayUrl);

    relay.on('connect', async () => {
        console.log(`Connected to ${relay.url}`);
        try {
            let queries: any = [{ limit: defaultLimit }]

            const parsedKinds = parseKindsSelection(kinds)
            if (parsedKinds.length !== 0) {
                queries[0]["kinds"] = parsedKinds;
            }

            if (author !== "") {
                queries[0]["authors"] = [author];
            }

            // get events from the relay
            const eventsRaw = await relay.list(queries);

            setEvents(eventsRaw);
        } catch (error: any) {
            console.error(`Error listing events: ${error.message}`);
            setErrorMessage(error.message)
        }
    });

    relay.on('error', () => {
        setErrorMessage(`Failed to connect to ${relay.url}`);
    });


    // Establish a connection with the relay
    relay.connect();
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4">
      <h1 className="text-3xl font-bold underline text-center mt-4">Nostr Relay Explorer</h1>
      <div id="relay-selector" className="mt-4 w-full md:max-w-md lg:max-w-lg mx-auto">
        <form id="queryForm" onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group input-group-lg">
              <span className="input-group-text" id="relay-url-descriptor">Relay</span>
              <input
                id="relay"
                placeholder="wss://relay.damus.io"
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                aria-label="Relay URL"
                aria-describedby="relay-url-descriptor"
                value={relayUrl}
                onChange={(e) => setRelayUrl(e.target.value)}
              />
          </div>
          <div className="mt-4">
              <label htmlFor="author" className="form-label">Author (public key)</label>
              <input
                id="author"
                placeholder={examplePubkey}
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                aria-label="Author public key"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <div className="form-text">Must be a hex public key, convert npub to hex <a href="https://nostrcheck.me/converter/" className="text-blue-500 underline" target="_blank">here</a>. Leave blank to query all authors.</div>
          </div>
          <div className="mt-4">
              <label htmlFor="kinds-selection" className="form-label">Kinds of Events</label>
              <select onChange={handleKindsChange} value={kinds} multiple className="form-multiselect block w-full px-3 py-2 rounded-md border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option key={""} value={""}>All</option>
                  {Object.entries(NOSTR_KINDS).map(([kind, kindDisplay]) => (
                      <option key={kind} value={kind}>{kindDisplay}</option>
                  ))}
              </select>
              <div className="form-text">List of kinds and what they mean can be found <a href="https://github.com/nostr-protocol/nips" className="text-blue-500 underline" target="_blank">here</a></div>
          </div>
          <div className="mt-4">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Query</button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold mb-2">Results</h3>
        <EventsDisplay events={events} />
      </div>

      {errorMessage !== "" ? (
        <div className="alert alert-danger mt-4" role="alert">{errorMessage}</div>
      ) : null }
    </div>
  )
}

export default HomePage;
