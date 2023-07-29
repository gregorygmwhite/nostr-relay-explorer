import {
    ReactElement,
    useState,
    useEffect,
} from "react";
import Relay from "../../types/relays";
import RelayCard from "../../components/relays/relayCard";
import urls from "../../config/urls";
import { generateFullApiURL } from "../../utils/api";

import {
    useParams
} from "react-router-dom";

const RelayDetailPage = (): ReactElement => {

    let { id } = useParams<{ id: string }>();
    const [relay, setRelay] = useState<Relay>({} as Relay);
    const [relayFetchError, setRelayFetchError] = useState<string>("");


    useEffect(() => {
      async function getRelay() {
        try {
            if (id === undefined) {
                throw new Error(`Missing relay ID`);
            }
            const apiRoute = generateFullApiURL(urls.api.getRelayDetail(id))
            const response = await fetch(apiRoute);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const relayData = await response.json();
            setRelay(relayData);
        } catch (error: any) {
            console.error(`Failed to fetch relays`, error);
            setRelayFetchError(error.message);
        }
      }

      getRelay();
    }, []);

    return (
        <div className="container mt-4">
            {relayFetchError !== "" ? (
                <div className="alert alert-danger" role="alert">
                    {relayFetchError}
                </div>
            ) : (
                <RelayCard relay={relay} />
            )}
        </div>
    )
}

export default RelayDetailPage;
