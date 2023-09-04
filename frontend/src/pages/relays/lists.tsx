import { useState, useEffect, useRef } from 'react';
import urls from '../../config/urls';
import Relay from "../../types/relays";
import RelaysList from "../../components/relays/list";
import { generateFullApiURL } from '../../utils/api'
import { Card, Form } from "react-bootstrap";
import LoadingIndicator from '../../components/common/loadingIndicator';
import { relayInit, nip05 } from 'nostr-tools';
import CopyableText from '../../components/common/copyableText';
import { isValidRelayUrl } from '../../utils/relayUtils';
import { isValidPubKey } from '../../utils/publicKeys';
import { EventKind } from '../../types/event';

export default function RelayListsPage() {
  const defaultLimit = 100;

  const [fetchingRelays, setFetchingRelays] = useState<boolean>(false);
  const [hasEverStartedFetchingRelays, setHasEverStartedFetchingRelays] = useState<boolean>(false);

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");

  const [nip5Filter, setNip5Filter] = useState<string>("");
  const [nip5RelayList, setNip5RelayList] = useState<string[]>([]);  // new state value for the debounced search term
  const [nip5PubKey, setNip5PubKey] = useState<string>("");  // new state value for the debounced search term

  const [userFilter, setUserFilter] = useState<string>("");
  const [relayURLFilter, setRelayURLFilter] = useState<string>("");

  const [activeTab, setActiveTab] = useState<string>("nip5");

  const prevNip5Filter = useRef(nip5Filter);

  const resetContext = function() {
    setRelayFetchError("");
    setRelays([])
    setNip5RelayList([])
    setNip5PubKey("")
    setUserFilter("")
    setRelayURLFilter("")
    setHasEverStartedFetchingRelays(false)
  }

  ////////
  // Logic pertaining to retrieving a relay list published by the NIP 5 address itself
  ///////

  // debounce text filter

  async function getRelaysFromNip5() {
    try {
      const relayUrls = await getRelayUrlsFromNIP5(nip5Filter)
      setNip5RelayList(relayUrls);
    } catch (error: any) {
      console.error(`Failed to fetch relays from NIP 5 address`, error);
      setRelayFetchError(error.message);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      getRelaysFromNip5()
    }, 1200);

    return () => {
      clearTimeout(handler);
    };
  }, [nip5Filter]);

  useEffect(() => {
    if (
      prevNip5Filter.current === nip5Filter &&
      relays.length !== 0
    ) {
      return; // Skip calling getRelays if filters have not changed
    }

    prevNip5Filter.current = nip5Filter;


    if (nip5RelayList.length > 0) {
      getRelaysFromBackend();
    }
  }, [nip5RelayList]);

  async function getRelaysFromBackend() {
    try {
      setFetchingRelays(true)
      setHasEverStartedFetchingRelays(true)
      const queryParams = new URLSearchParams({
        nip5Filter: nip5Filter, // ignored by backend
        relay_urls: nip5RelayList.join(","), // actually used by backend
      });
      const fullAPIRoute = generateFullApiURL(`${urls.api.relaysList}?${queryParams}`);
      const response = await fetch(fullAPIRoute);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const relaysRaw = await response.json();

      // TODO: add in any rows for relays in the list from the profil metadata
      // that the backend isn't aware of yet

      setFetchingRelays(false)
      setRelays(relaysRaw);
    } catch (error: any) {
      console.error(`Failed to fetch relays`, error);
      setFetchingRelays(false)
      setRelayFetchError(error.message);
    }
  }

  async function getRelayUrlsFromNIP5(nip5: string) {
    resetContext()
    let nip5Relays: string[] = []
    if (!nip5) {
      return nip5Relays
    }
    let profile = await nip05.queryProfile(nip5)
    if (profile) {

      if (profile.pubkey) {
        setNip5PubKey(profile.pubkey)
      }

      if (profile.relays) {
        nip5Relays = profile.relays
      } else {
        throw new Error(`No relays found for NIP 5 address ${nip5}`)
      }

    }

    return nip5Relays
  }

  ////////
  // Logic pertaining to finding published relay lists by a user
  ///////

  async function getPublicKeyFromNIP5(nip5: string) {
    if (!nip5) {
      return undefined
    }
    let profile = await nip05.queryProfile(nip5)
    if (profile && profile.pubkey) {
        return profile.pubkey
    }

    return undefined
  }

  function parseRelayListFromEvent(event: any): string[] {
    let relayList: string[] = []
    if (event && event.tags && event.tags.length > 0) {
      for (let tag of event.tags) {
        if (tag.length >= 2 && tag[0] === "r" && isValidRelayUrl(tag[1])) {
          relayList.push(tag[1])
        }
      }
    }
    return relayList
  }

  async function setNip5RelayListFromRelayByNostrAccount(pubkey: string, relayURL: string) {
    // import and initialize the relay
    const relay = relayInit(relayURL);

    relay.on('connect', async () => {
        console.log(`Connected to ${relay.url}`);
        try {
            let queries: any = [{ limit: defaultLimit }]

            queries[0]["kinds"] = [EventKind.RelayListMetadata];

            queries[0]["authors"] = [pubkey]

            // get events from the relay
            const eventsRaw = await relay.list(queries);
            if (eventsRaw.length === 0) {
              throw new Error(`No events found for pubkey ${pubkey} and relay ${relayURL}`)
            }
            const latestEvent = eventsRaw[0]
            const relayUrls = parseRelayListFromEvent(latestEvent)
            setNip5RelayList(relayUrls);
        } catch (error: any) {
            console.error(`Failed to fetch relays from published relays list`, error);
            setFetchingRelays(false)
            setRelayFetchError(error.message);
        }
    });

    relay.on('error', () => {
      console.error(`Error connecting to ${relay.url}`);
      setFetchingRelays(false)
      setRelayFetchError(`Error connecting to specified relay: ${relay.url}`);
    });

    // Establish a connection with the relay
    relay.connect();
  }

  async function getRelayListForUserAndRelay() {
    resetContext();
    setFetchingRelays(true)
    setHasEverStartedFetchingRelays(true)

    let pubkey;
    if (userFilter.includes("@")) {
      try {
        pubkey = await getPublicKeyFromNIP5(userFilter);
        if (pubkey === undefined) {
          throw new Error(`No public key found for NIP 5 address: ${userFilter}`)
        }
      } catch (error: any) {
        console.error(error.message);
        setFetchingRelays(false)
        setRelayFetchError(error.message);
      }
    } else if (isValidPubKey(userFilter)) {
      pubkey = userFilter;
    } else {
      setFetchingRelays(false)
      setRelayFetchError("Invalid nostr account, must be a NIP 5 address or a public key: " + userFilter);
    }

    if (pubkey) {
      try {
        setNip5RelayListFromRelayByNostrAccount(pubkey, relayURLFilter);
      } catch (error: any) {
        console.error(`Failed to fetch relay lists for the NOST account and relay URL`, error);
        setRelayFetchError(error.message);
      }
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      if (userFilter && relayURLFilter) {
        getRelayListForUserAndRelay();
      }
    }, 1200);

    return () => {
      clearTimeout(handler);
    };
  }, [userFilter, relayURLFilter]);


  ////////
  // Logic pertaining to the UX itself
  ///////

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    resetContext()
  };


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  ////////
  // The UX itself
  ///////

  return (
    <div className="container mt-2">
      <Card className="mt-2 p-4">
        <div className="mb-3">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "nip5" ? "active" : ""}`}
                  onClick={() => handleTabChange("nip5")}
                >
                  NIP 5 Address
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "other" ? "active" : ""}`}
                  onClick={() => handleTabChange("other")}
                >
                  Published relay list
                </button>
              </li>
            </ul>
          </div>
          {activeTab === "nip5" ? (
          // NIP 5 Address tab content
          <form onSubmit={handleFormSubmit} style={{ maxWidth: "40rem" }}>
            <Form.Group className="mb-3">
              <Form.Label>Find by NIP 5 Address</Form.Label>
              <Form.Control
                type="text"
                id="text-search"
                value={nip5Filter}
                placeholder="jb55@jb55.com"
                onChange={(e) => setNip5Filter(e.target.value)}
              />
              {nip5PubKey.length > 0 && (
                <Form.Text className="text-muted">
                  <div className="d-flex flex-row">
                    <div className="me-2">Pubkey:</div>
                    <CopyableText text={nip5PubKey} buttonAlignment="right" />
                  </div>
                </Form.Text>
              )}
            </Form.Group>
          </form>
        ) : (
          // Other tab content (user-search and relay-url-search)
          <form onSubmit={handleFormSubmit} style={{ maxWidth: "40rem" }}>
            <Form.Group className="mb-3">
              <Form.Label>Published by</Form.Label>
              <Form.Control
                type="text"
                id="user-search"
                value={userFilter}
                placeholder="jb55@jb55.com or 32e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245"
                onChange={(e) => setUserFilter(e.target.value)}
              />
              <Form.Text className="text-muted">
                NIP 5 Address or Public Key of a nostr account
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>On relay</Form.Label>
              <Form.Control
                type="text"
                id="relay-url-search"
                value={relayURLFilter}
                placeholder="wss://example.com/ws"
                onChange={(e) => setRelayURLFilter(e.target.value)}
              />
            </Form.Group>
          </form>
        )}
      </Card>
      {relayFetchError && (
        <div className="alert alert-danger mt-4" role="alert">
          {relayFetchError}
        </div>
      )}
      <div className="mt-3">
        {fetchingRelays ? (
          <LoadingIndicator />
        ) : (
          <>
            {(relays.length === 0 && relayFetchError === "") ? (
              <>
               {(hasEverStartedFetchingRelays && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-body">
                    <p className="card-text">No matching relays</p>
                  </div>
                </div>
               ))}
              </>
            ) : (
              <RelaysList relays={relays} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
