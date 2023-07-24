import EventsDisplay from "../components/events/events";
import { NOSTR_KINDS } from "../config/consts";
import { NostrEvent } from "../types/event";
import { useState } from "react";
import { relayInit } from 'nostr-tools';
import RelayMetadata from "../components/relays/relayMetadata";
import { Container, Form, FormGroup, InputGroup, Button, Alert } from 'react-bootstrap';

const HomePage = () => {

  const defaultLimit = 100;
  const examplePubkey = "d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027";

  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [relayUrl, setRelayUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [kinds, setKinds] = useState<string[]>([""]);
  const [metadata, setMetadata] = useState<any>({});
  const [eventsErrorMessage, setEventsErrorMessage] = useState("");
  const [metadataErrorMessage, setMetadataErrorMessage] = useState("");


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

  async function getRelayMetadata(relayUrl: string) {
    // Replace "ws://" or "wss://" with "http://"
    const httpUrl = relayUrl.replace(/^ws(s?):\/\//, 'http$1://');

    try {
        const response = await fetch(httpUrl, {
            headers: {
                'Accept': 'application/nostr+json',
            },
        });

        // Ensure the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const metadataRaw = await response.json();
        setMetadata(metadataRaw);

    } catch (error: any) {
        console.error(`Failed to fetch relay metadata from ${httpUrl}`, error);
        setMetadataErrorMessage(error.message)
    }
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
            setEventsErrorMessage(error.message)
        }
    });

    relay.on('error', () => {
        setEventsErrorMessage(`Failed to connect to ${relay.url}`);
    });

    // Get metadata from the relay
    getRelayMetadata(relay.url)

    // Establish a connection with the relay
    relay.connect();
  }

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Nostr Relay Explorer</h1>

      <Container className="mb-4">
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text id="relay-url-descriptor">Relay</InputGroup.Text>
            <Form.Control
              id="relay"
              placeholder="wss://relay.damus.io"
              type="text"
              value={relayUrl}
              onChange={(e) => setRelayUrl(e.target.value)}
            />
          </InputGroup>

          <FormGroup className="mb-3">
            <Form.Label>Author (public key)</Form.Label>
            <Form.Control
              id="author"
              placeholder={examplePubkey}
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <Form.Text className="text-muted">Must be a hex public key, convert npub to hex <a href="https://nostrcheck.me/converter/" className="text-info">here</a>. Leave blank to query all authors.</Form.Text>
          </FormGroup>

          <FormGroup className="mb-3">
            <Form.Label>Kinds of Events</Form.Label>
            <Form.Select onChange={handleKindsChange} defaultValue="" value={kinds} multiple>
              <option key={""} value={""}>All</option>
              {Object.entries(NOSTR_KINDS).map(([kind, kindDisplay]) => (
                  <option key={kind} value={kind}>{kindDisplay}</option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">List of kinds and what they mean can be found <a href="https://github.com/nostr-protocol/nips" className="text-info">here</a></Form.Text>
          </FormGroup>

          <Button type="submit" variant="primary" className="mb-3">Query</Button>
        </Form>
      </Container>

      <div className="mt-4">
        <h3 className="text-2xl font-bold mb-2">Metadata</h3>
        <RelayMetadata metadata={metadata} />
      </div>

      <div className="mt-4">
        <h3 className="mb-2">Results</h3>
        <EventsDisplay events={events} />
      </div>

      {eventsErrorMessage && (
        <Alert variant="danger" className="mt-4">{eventsErrorMessage}</Alert>
        )}
      {metadataErrorMessage && (
        <Alert variant="danger" className="mt-4">{metadataErrorMessage}</Alert>
      )}

    </Container>
  )
}

export default HomePage;
