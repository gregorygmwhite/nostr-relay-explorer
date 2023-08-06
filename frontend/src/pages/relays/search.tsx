import { useState, useEffect, useRef } from 'react';
import urls from '../../config/urls';
import Relay from "../../types/relays";
import RelaysList from "../../components/relays/list";
import { generateFullApiURL} from '../../utils/api'
import { Card, Form } from "react-bootstrap";
import LoadingIndicator from '../../components/common/loadingIndicator';
import { SPECIAL_RELAY_NIPS, RELAY_NIPS } from '../../config/consts';

export default function RelaySearchPage() {

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");
  const [fetchingRelays, setFetchingRelays] = useState<boolean>(false);

  const [supportedNipsFilter, setSupportedNipsFilter] = useState<string[]>([]);
  const [textFilter, setTextFilter] = useState<string>("");
  const [paymentRequiredFilter, setPaymentRequiredFilter] = useState<string>("");
  const [debouncedTextFilter, setDebouncedTextFilter] = useState<string>("");  // new state value for the debounced search term

  const ORDERING_CHOICES = {
    "activity_assessment": "Usage",
    "name": "Name",
    "url": "Relay URL",
  }
  const [orderingChoice, setOrderingChoice] = useState<string>("activity_assessment");

  const prevTextFilter = useRef(textFilter);
  const prevPaymentRequiredFilter = useRef(paymentRequiredFilter);
  const prevSupportedNipsFilter = useRef(supportedNipsFilter);
  const prevOrderingChoice = useRef(orderingChoice);
  const isFirstRender = useRef(true);

  function clearContext() {
    setRelayFetchError("");
    setRelays([]);
    setFetchingRelays(false);
  }


  async function getRelays() {
    try {
      clearContext()
      setFetchingRelays(true);

      let parsedSupportedNipsFilter = supportedNipsFilter.filter((nip: string) => {
        return nip !== "";
      });

      const queryParams = new URLSearchParams({
        search: debouncedTextFilter,
        payment_required: paymentRequiredFilter,
        supported_nips: parsedSupportedNipsFilter.join(","),
        ordering: orderingChoice,
      });

      const fullAPIRoute = generateFullApiURL(`${urls.api.relaysList}?${queryParams}`);
      const response = await fetch(fullAPIRoute);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const relaysRaw = await response.json();
      setFetchingRelays(false);
      setRelays(relaysRaw);
    } catch (error: any) {
      console.error(`Failed to fetch relays`, error);
      setFetchingRelays(false);
      setRelayFetchError(error.message);
    }
  }


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
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (
      prevTextFilter.current === debouncedTextFilter &&
      prevPaymentRequiredFilter.current === paymentRequiredFilter &&
      prevSupportedNipsFilter.current === supportedNipsFilter &&
      prevOrderingChoice.current === orderingChoice &&
      relays.length !== 0
    ) {
      return; // Skip calling getRelays if filters have not changed
    }

    prevTextFilter.current = debouncedTextFilter;
    prevPaymentRequiredFilter.current = paymentRequiredFilter;
    prevSupportedNipsFilter.current = supportedNipsFilter;
    prevOrderingChoice.current = orderingChoice;

    getRelays();
  }, [debouncedTextFilter, paymentRequiredFilter, supportedNipsFilter, orderingChoice]);


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSupportedNipsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSupportedNipsFilter(selectedOptions);
};

  return (
    <div className="container mt-2">
      <Card className="mt-2 p-4">
          <form onSubmit={handleFormSubmit} style={{ maxWidth: "40rem"}}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  id="text-search"
                  value={textFilter}
                  placeholder="Relay name, relay url, relay pubkey"
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
              <Form.Group className="mb-3">
                <Form.Label>Supported features</Form.Label>
                <Form.Select onChange={handleSupportedNipsChange} defaultValue={[""]} multiple>
                  <option key={""} value={""}>Any</option>
                  {SPECIAL_RELAY_NIPS.map((nip) => (
                      <option key={nip} value={nip}>{`${RELAY_NIPS[nip]} (NIP ${nip})`}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">List of NIPs can be found <a href="https://github.com/nostr-protocol/nips" target="_blank" className="text-info">here</a></Form.Text>
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
          <>
            {relays.length === 0 ? (
              <div className="card mt-4 shadow-sm">
                <div className="card-body">
                  <p className="card-text">No matching relays</p>
                </div>
              </div>
            ): (
              <>
                <Form.Group style={{ maxWidth: "10rem" }}>
                  <Form.Label>Order by</Form.Label>
                  <Form.Select
                    aria-label="Order by"
                    value={orderingChoice}
                    onChange={(e) => setOrderingChoice(e.target.value)}
                  >
                    {Object.entries(ORDERING_CHOICES).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <RelaysList relays={relays} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

