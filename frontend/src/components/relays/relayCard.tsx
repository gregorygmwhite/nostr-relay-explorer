import { ReactElement } from "react";
import Relay from "../../types/relays";
import RelayMetadata from "./relayMetadata";
import { Link } from "react-router-dom";
import pages from "../../config/pages";
import getSupportedNipsDisplay from "../../utils/getSupportedNipsDisplay";
import { Accordion, Card } from "react-bootstrap";

const RelayCard = ({
    relay
}: {
    relay: Relay
}): ReactElement => {
    return (
        <Card key={relay.id} className="mb-4">
            <div className="m-4">
                <Card.Title>
                    <Link to={pages.getRelayView(relay.id)}>
                        {relay.name}
                    </Link>
                </Card.Title>
                <Card.Subtitle className="text-muted">{relay.url}</Card.Subtitle>
            </div>
            <Card.Body className="pt-0">
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Relay Software</Accordion.Header>
                        <Accordion.Body>
                            <p>Pubkey: {relay.pubkey}</p>
                            <p>Software: {relay.software}</p>
                            <p>Version: {relay.version}</p>
                            <p>Supported NIPs: {getSupportedNipsDisplay(relay.supported_nips)}</p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Payment Details</Accordion.Header>
                        <Accordion.Body>
                            <p>Payment Required: {relay.payment_required ? 'Yes' : 'No'}</p>
                            <p>Payments URL: {relay.payments_url}</p>
                            <p>Admission Fees (Sats): {relay.admission_fees_sats}</p>
                            <p>Publication Fees (Sats): {relay.publication_fees_sats}</p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Tacking Details</Accordion.Header>
                        <Accordion.Body>
                            <p>Tracking since: {relay.tracked_since}</p>
                            <p>Last update: {relay.last_metadata_update}</p>
                            <p>Last update success: {relay.last_update_success ? 'Yes' : 'No'}</p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Full Relay Metadata</Accordion.Header>
                        <Accordion.Body>
                            <RelayMetadata metadata={relay.full_metadata} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    );
}

export default RelayCard;
