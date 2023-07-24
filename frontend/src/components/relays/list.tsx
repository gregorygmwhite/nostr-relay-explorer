import { ReactElement } from "react";
import Relay from "../../types/relays";
import RelayMetadata from "./relayMetadata";


const RelaysList = ({
    relays,
  }: {
    relays: Relay[];
  }): ReactElement => {

    let relaysList: ReactElement[] = []
    if (relays !== undefined) {
        relaysList = (
            relays.map((relay: Relay) => (
                <div key={relay.id} className="p-6 my-4 border border-gray-300 rounded shadow">
                    <h3 className="font-bold text-xl">{relay.name}</h3>
                    <p>URL: {relay.url}</p>
                    {/* <p>Registered At: {new Date(relay.registered_at).toLocaleString()}</p> */}
                    <RelayMetadata metadata={relay.metadata} />
                </div>
            )
        ))
    }

    return (
      <div>
        {relays === undefined ? (<div>Loading...</div>) : (
            relays.length > 0 ? (
                <div>
                    <div className="text-xl font-bold">Latest {relays.length} relays</div>
                    {relaysList}
                </div>
                ) : (
                <div className="p-6 my-4 border border-gray-300 rounded shadow">
                    <p>No relays found</p>
                </div>
            )
        )}
      </div>
    );
  };

  export default RelaysList;
