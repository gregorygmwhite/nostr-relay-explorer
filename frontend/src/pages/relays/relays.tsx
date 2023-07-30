import { useState, useEffect } from 'react';
import urls from '../../config/urls';
import pages from '../../config/pages';
import Relay from "../../types/relays";
import { Link } from 'react-router-dom';
import RelaysList from "../../components/relays/list";
import { generateFullApiURL} from '../../utils/api'
import { Card, Form } from "react-bootstrap";

export default function RelayListPage() {

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");

  const [textFilter, setTextFilter] = useState<string>("");
  const [paymentRequiredFilter, setPaymentRequiredFilter] = useState<string>("");  // "" (no selection), "required", "not-required"


  useEffect(() => {
    async function getRelays() {
      try {
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
        setRelays(relaysRaw);
      } catch (error: any) {
        console.error(`Failed to fetch relays`, error);
        setRelayFetchError(error.message);
      }
    }

    getRelays();
  }, [textFilter, paymentRequiredFilter]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mt-2">Relays</h1>
        <Link
          to={pages.relays.create}
          className="btn btn-primary"
          >
            Create Relay
        </Link>
      </div>
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
        <RelaysList relays={relays} />
      </div>
    </div>
  );
}

