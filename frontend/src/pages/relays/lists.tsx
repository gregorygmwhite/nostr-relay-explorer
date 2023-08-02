import { useState, useEffect, useRef } from 'react';
import urls from '../../config/urls';
import Relay from "../../types/relays";
import RelaysList from "../../components/relays/list";
import { generateFullApiURL } from '../../utils/api'
import { Card, Form } from "react-bootstrap";
import LoadingIndicator from '../../components/common/loadingIndicator';
import {nip05} from 'nostr-tools'
import CopyableText from '../../components/common/copyableText';


export default function RelayListsPage() {

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");
  const [fetchingRelays, setFetchingRelays] = useState<boolean>(false);

  const [nip5Filter, setNip5Filter] = useState<string>("");
  const [nip5RelayList, setNip5RelayList] = useState<string[]>([]);  // new state value for the debounced search term
  const [nip5PubKey, setNip5PubKey] = useState<string>("");  // new state value for the debounced search term

  const prevNip5Filter = useRef(nip5Filter);

  const resetContext = function() {
    setRelayFetchError("");
    setRelays([])
    setNip5RelayList([])
    setNip5PubKey("")
  }

  // debounce text filter
  useEffect(() => {
    const handler = setTimeout(() => {

      async function getRelaysFromNip5() {
        try {
          const relayUrls = await getRelayUrlsFromNIP5(nip5Filter)
          debugger;
          setNip5RelayList(relayUrls);
        } catch (error: any) {
          console.error(`Failed to fetch relays from NIP 5 address`, error);
          setRelayFetchError(error.message);
        }
      }
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

    async function getRelaysFromBackend() {
      try {
        setFetchingRelays(true)
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
    if (nip5RelayList.length > 0) {
      getRelaysFromBackend();
    }
  }, [nip5RelayList]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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

  return (
    <div className="container mt-2">
      <Card className="mt-2 p-4">
          <form onSubmit={handleFormSubmit} style={{ maxWidth: "40rem"}}>
              <Form.Group className="mb-3">
                <Form.Label>Find by NIP 5 Address</Form.Label>
                <Form.Control
                  type="text"
                  id="text-search"
                  value={nip5Filter}
                  placeholder="jb55@jb55.com"
                  onChange={(e) => setNip5Filter(e.target.value)}
                />
              </Form.Group>
              {nip5PubKey.length > 0 && (
                <Form.Text className="text-muted">
                  <div className="d-flex flex-row">
                    <div className="me-2">Pubkey:</div>
                    <CopyableText text={nip5PubKey} buttonAlignment="right" />
                  </div>
                </Form.Text>
              )}
          </form>
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
              <div className="card mt-4 shadow-sm">
                <div className="card-body">
                  <p className="card-text">No matching relays</p>
                </div>
              </div>
            ) : (
              <RelaysList relays={relays} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
