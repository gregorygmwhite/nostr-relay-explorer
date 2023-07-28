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
          <p>Pubkey: {relay.pubkey}</p>
          <p>Contact: {relay.contact}</p>
          <p>Software: {relay.software}</p>
          <p>Version: {relay.version}</p>
          <p>Description: {relay.description}</p>
          <p>Supported NIPs: {relay.supported_nips}</p>
          <p>Payment Required: {relay.payment_required ? 'Yes' : 'No'}</p>
          <p>Payments URL: {relay.payments_url}</p>
          <p>Admission Fees (Sats): {relay.admission_fees_sats}</p>
          <p>Publication Fees (Sats): {relay.publication_fees_sats}</p>
          <RelayMetadata metadata={relay.full_metadata} />
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
