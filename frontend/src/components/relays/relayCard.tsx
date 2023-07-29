import { ReactElement } from "react";
import Relay from "../../types/relays";
import RelayMetadata from "./relayMetadata";
import { Link } from "react-router-dom";
import pages from "../../config/pages";
import getSupportedNipsDisplay from "../../utils/getSupportedNipsDisplay";

const RelayCard = ({
    relay
}: {
    relay: Relay
}): ReactElement => {
    return (
        <div key={relay.id} className="card my-3 shadow-sm">
            <div className="card-body">
                <h3 className="card-title">
                    <Link to={pages.getRelayView(relay.id)}>
                        {relay.name}
                    </Link>
                </h3>
                <p className="card-text">URL: {relay.url}</p>
                <p>Pubkey: {relay.pubkey}</p>
                <p>Contact: {relay.contact}</p>
                <p>Software: {relay.software}</p>
                <p>Version: {relay.version}</p>
                <p>Description: {relay.description}</p>
                <p>Supported NIPs: {getSupportedNipsDisplay(relay.supported_nips)}</p>
                <p>Payment Required: {relay.payment_required ? 'Yes' : 'No'}</p>
                <p>Payments URL: {relay.payments_url}</p>
                <p>Admission Fees (Sats): {relay.admission_fees_sats}</p>
                <p>Publication Fees (Sats): {relay.publication_fees_sats}</p>
                <p>Tracking since: {relay.tracked_since}</p>
                <p>Last update: {relay.last_metadata_update}</p>
                <p>Last update success: {relay.last_update_success ? 'Yes' : 'No'}</p>
                <RelayMetadata metadata={relay.full_metadata} />
            </div>
        </div>
    )
}

export default RelayCard;
