import { ReactElement } from "react";
import Relay from "../../types/relays";
import RelayMetadata from "./relayMetadata";

const RelaysList = ({
  relays,
}: {
  relays: Relay[];
}): ReactElement => {
  let relaysList: ReactElement[] = [];
  if (relays !== undefined) {
    relaysList = relays.map((relay: Relay) => (
      <div key={relay.id} className="card my-3 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">{relay.name}</h3>
          <p className="card-text">URL: {relay.url}</p>
          {/* <p>Registered At: {new Date(relay.registered_at).toLocaleString()}</p> */}
          <RelayMetadata metadata={relay.metadata} />
        </div>
      </div>
    ));
  }

  return (
    <div>
      {relays === undefined ? (
        <div>Loading...</div>
      ) : relays.length > 0 ? (
        <div>
          <div className="h4 font-weight-bold">
            Latest {relays.length} relays
          </div>
          {relaysList}
        </div>
      ) : (
        <div className="card my-3 shadow-sm">
          <div className="card-body">
            <p className="card-text">No relays found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelaysList;
