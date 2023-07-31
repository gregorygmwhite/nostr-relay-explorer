import { useLocation, useSearchParams } from 'react-router-dom';
import EventsDisplay from "../components/events/events";
import { NOSTR_KINDS } from "../config/consts";
import { NostrEvent } from "../types/event";
import { useState, useEffect } from "react";
import { relayInit } from 'nostr-tools';
import LoadingIndicator from '../components/common/loadingIndicator';
import RelayMetadata from "../components/relays/relayMetadata";
import {
  Container,
  Form,
  FormGroup,
  InputGroup,
  Button,
  Alert,
  Accordion,
  Card,
} from 'react-bootstrap';
import { Check } from 'react-bootstrap-icons';

const InspectorPage = () => {

  const defaultLimit = 100;
  const examplePubkey = "d7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027";

  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState<boolean>(false);
  const [eventsErrorMessage, setEventsErrorMessage] = useState("");

  const [relayUrl, setRelayUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [kinds, setKinds] = useState<string[]>([""]);

  const [metadata, setMetadata] = useState<any>({});
  const [metadataLoading, setMetadataLoading] = useState<boolean>(false);
  const [metadataErrorMessage, setMetadataErrorMessage] = useState("");

  const clearQueries = () => {
    setEvents([]);
    setEventsErrorMessage("");
    setMetadata({});
    setMetadataErrorMessage("");

    setRelayUrl("");
    setAuthor("");
    setKinds([""]);
  }

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
    setMetadataLoading(true);
    setMetadata({})
    setMetadataErrorMessage("");
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
        setMetadataLoading(false);
        setMetadataErrorMessage("");

    } catch (error: any) {
        console.error(`Failed to fetch relay metadata from ${httpUrl}`, error);
        setMetadataErrorMessage(error.message)
        setMetadataLoading(false);
    }
  }


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the form from reloading the page

    const newParams = { relayUrl: relayUrl };
    setSearchParams(newParams);

    // import and initialize the relay
    const relay = relayInit(relayUrl);
    setEventsLoading(true);
    setEvents([]);
    setEventsErrorMessage("");

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
            setEventsLoading(false);
            setEventsErrorMessage("");
        } catch (error: any) {
            console.error(`Error listing events: ${error.message}`);
            setEventsErrorMessage(error.message)
            setEventsLoading(false);
        }
    });

    relay.on('error', () => {
        setEventsErrorMessage(`Failed to connect to ${relay.url}`);
        setEventsLoading(false);
    });

    // Get metadata from the relay
    getRelayMetadata(relay.url)

    // Establish a connection with the relay
    relay.connect();
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const relayUrlParam = queryParams.get('relayUrl');

    if (relayUrlParam) {
      setRelayUrl(relayUrlParam);
    }
  }, [location.search]);

  return (
    <Container className="mt-3">
      <Card className="mb-4 p-4">
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
          <div className="mb-3">
            <InputGroup>
              <InputGroup.Text id="relay-url-descriptor">Author (pubkey)</InputGroup.Text>
              <Form.Control
                id="author"
                placeholder={examplePubkey}
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </InputGroup>
            <Form.Text className="text-muted">
              Must be a hex public key, convert npub to hex <a href="https://nostrcheck.me/converter/" className="text-info" target="_blank">here</a>. Leave blank to query all authors.
            </Form.Text>
          </div>

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

          <div className="mt-3 w-100 d-flex flex-row-reverse">
            <div>
              <Button type="submit" variant="primary" className="">Query</Button>
            </div>
            <div className="me-2">
              <Button variant="secondary" onClick={clearQueries}>Clear</Button>
            </div>
          </div>
        </Form>
      </Card>

      <div className="mt-4">
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex flex-row">
                    <h3 className="text-2xl font-bold mb-2 me-3">
                      Metadata
                    </h3>
                    {Object.keys(metadata).length !== 0 && (
                        <Check size={35} />
                    )}
                    {metadataLoading && (
                      <div className="ml-3">
                        <LoadingIndicator />
                      </div>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <RelayMetadata metadata={metadata} />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
      </div>

      <div className="mt-4">
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <div className="d-flex flex-row">
                    <h3 className="text-2xl font-bold mb-2 me-3">
                      Events {events.length ? `(${events.length})` : "" }
                    </h3>
                    {eventsLoading && (
                        <LoadingIndicator />
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <EventsDisplay events={events} />
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
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

export default InspectorPage;
