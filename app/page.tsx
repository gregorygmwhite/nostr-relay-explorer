'use client'

import EventsDisplay from "../components/events";
import { NOSTR_KINDS } from "@/config/consts";
import { useState } from "react";
import { relayInit } from 'nostr-tools';

const HomePage = () => {

  const defaultLimit = 100;
  const examplePubkey = "d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027";

  const [events, setEvents] = useState([]);
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

    relay.on('error', (error: any) => {
        setErrorMessage(`Failed to connect to ${relay.url}: ${error}`);
    });

    // Establish a connection with the relay
    relay.connect();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Nostr Relay Explorer</h1>
      <div id="relay-selector" className="mt-4">
        <form id="queryForm" onSubmit={handleSubmit}>
            <div className="input-group input-group-lg">
                <span className="input-group-text" id="relay-url-descriptor">Relay</span>
                <input
                  id="relay"
                  placeholder="wss://relay.damus.io"
                  type="text"
                  className="form-control"
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
                  className="form-control"
                  aria-label="Author public key"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
                <div className="form-text">Must be a hex public key, convert npub to hex <a href="https://nostrcheck.me/converter/" target="_blank">here</a>. Leave blank to query all authors.</div>
            </div>
            <div className="mt-4">
                <label htmlFor="kinds-selection" className="form-label">Kinds of Events</label>
                <select onChange={handleKindsChange} defaultValue="" value={kinds} multiple>
                    <option key={""} value={""}>All</option>
                    {Object.entries(NOSTR_KINDS).map(([kind, kindDisplay]) => (
                        <option key={kind} value={kind}>{kindDisplay}</option>
                    ))}
                </select>
                <div className="form-text">List of kinds and what they mean can be found <a href="https://github.com/nostr-protocol/nips" target="_blank">here</a></div>
            </div>
            <div className="button-group mt-4 clearfix">
                <button type="submit" className="btn btn-outline-primary btn-lg float-end">Query</button>
            </div>
        </form>
        {errorMessage !== "" ? (
          <div className="alert alert-danger mt-4" role="alert">{errorMessage}</div>
        ) : (
          <EventsDisplay events={events}/>
        )}
      </div>
    </div>
  )
}

export default HomePage;
