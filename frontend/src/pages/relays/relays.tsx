import { useState, useEffect } from 'react';
import urls from '../../config/urls';
import pages from '../../config/pages';
import Relay from "../../types/relays";
import { Link } from 'react-router-dom';
import RelaysList from "../../components/relays/list";
import { generateFullApiURL} from '../../utils/api'

export default function RelayListPage() {

  const [relays, setRelays] = useState<Relay[]>([]);
  const [relayFetchError, setRelayFetchError] = useState<string>("");


  useEffect(() => {
    async function getRelays() {
      try {
        const fullAPIRoute = generateFullApiURL(urls.api.relaysList)
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
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mt-4">Relays</h1>
        <Link
          to={pages.relays.create}
          className="btn btn-primary"
          >
            Create Relay
        </Link>
      </div>
      <div className="mt-4">
        <RelaysList relays={relays} />
      </div>
    </div>
  );
}

