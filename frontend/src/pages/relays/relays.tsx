import { useState, useEffect, useRef } from 'react';
import urls from '../../config/urls';
import Relay from "../../types/relays";
import RelaysList from "../../components/relays/list";
import { generateFullApiURL} from '../../utils/api'
import { Card, Form } from "react-bootstrap";
import LoadingIndicator from '../../components/common/loadingIndicator';

export default function RelayListPage() {

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");
  const [fetchingRelays, setFetchingRelays] = useState<boolean>(false);

  const [textFilter, setTextFilter] = useState<string>("");
  const [paymentRequiredFilter, setPaymentRequiredFilter] = useState<string>("");
  const [debouncedTextFilter, setDebouncedTextFilter] = useState<string>("");  // new state value for the debounced search term

  const prevTextFilter = useRef(textFilter);
  const prevPaymentRequiredFilter = useRef(paymentRequiredFilter);

  // debounce text filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTextFilter(textFilter);
    }, 1200);

    return () => {
      clearTimeout(handler);
    };
  }, [textFilter]);

  useEffect(() => {
    if (
      prevTextFilter.current === textFilter &&
      prevPaymentRequiredFilter.current === paymentRequiredFilter &&
      relays.length !== 0
    ) {
      return; // Skip calling getRelays if filters have not changed
    }

    prevTextFilter.current = textFilter;
    prevPaymentRequiredFilter.current = paymentRequiredFilter;

    async function getRelays() {
      try {
        setFetchingRelays(true)
        const queryParams = new URLSearchParams({
          search: textFilter,
          payment_required: paymentRequiredFilter,
        });
        const fullAPIRoute = generateFullApiURL(`${urls.api.relaysList}?${queryParams}`);
        const response = await fetch(fullAPIRoute);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const relaysRaw = await response.json();
        setFetchingRelays(false)
        setRelays(relaysRaw);
      } catch (error: any) {
        console.error(`Failed to fetch relays`, error);
        setFetchingRelays(false)
        setRelayFetchError(error.message);
      }
    }

    getRelays();
  }, [debouncedTextFilter, paymentRequiredFilter]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container mt-2">
      <Card className="mt-2 p-4">
          <form onSubmit={handleFormSubmit} style={{ maxWidth: "40rem"}}>
              <Form.Group className="mb-3">
              <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  id="text-search"
                  value={textFilter}
                  placeholder="name, url, pubkey"
                  onChange={(e) => setTextFilter(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Pubkey must be a hex public key, convert npub to hex <a href="https://nostrcheck.me/converter/" className="text-info" target="_blank">here</a>.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Payment Required</Form.Label>
                <Form.Select
                  aria-label="Payment Required"
                  value={paymentRequiredFilter}
                  onChange={(e) => setPaymentRequiredFilter(e.target.value)}
                >
                    <option value="">---</option>
                    <option value="true">Required</option>
                    <option value="false">Not Required</option>
                </Form.Select>
              </Form.Group>

          </form>
      </Card>
      {relayFetchError && (
        <div className="alert alert-danger mt-4" role="alert">
          {relayFetchError}
        </div>
      )}
      <div className="mt-3">
        {fetchingRelays ? <LoadingIndicator /> : (
          <RelaysList relays={relays} />
        )}
      </div>
    </div>
  );
}

