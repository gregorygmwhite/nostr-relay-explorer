import { ReactElement } from "react";
import Relay from "../../types/relays";
import RelayMetadata from "./relayMetadata";
import RelayCard from "./relayCard";

const RelaysList = ({
  relays,
}: {
  relays: Relay[];
}): ReactElement => {
  let relaysList: ReactElement[] = [];
  if (relays !== undefined) {
    relaysList = relays.map((relay: Relay) => (
      <RelayCard key={relay.id} relay={relay} />
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
