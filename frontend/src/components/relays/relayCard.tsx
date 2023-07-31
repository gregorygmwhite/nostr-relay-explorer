import { ReactElement } from "react";
import Relay from "../../types/relays";
import RelayMetadata from "./relayMetadata";
import pages from "../../config/pages";
import getSupportedNipsDisplay from "../../utils/getSupportedNipsDisplay";
import { Accordion, Card } from "react-bootstrap";
import { CurrencyBitcoin, X } from "react-bootstrap-icons";
import CopyableText from "../common/copyableText";
import StatusIndicator from "../common/statusIndicator";
import {
    humanReadableDateTimeFromISO,
    humanReadableDateFromISO
} from "../../utils/time";

const RelayCard = ({
    relay
}: {
    relay: Relay
}): ReactElement => {
    const hasCommunityPreferences = !!relay.posting_policy;
    const COMMUNITY_PREFERNCES_NIP = "https://github.com/nostr-protocol/nips/blob/master/11.md#community-preferences"

    return (
        <Card key={relay.id} className="mb-4">
            <div className="m-4 d-flex flex-row justify-content-between align-items-start">
                <div className="text-break">
                    <Card.Title>
                        {relay.name}
                    </Card.Title>
                    <Card.Subtitle className="text-muted">
                        <CopyableText text={relay.url} buttonAlignment="right" />
                    </Card.Subtitle>
                    {(relay.pubkey && relay.pubkey.length > 5) && (
                        <div className="text-muted">
                            <CopyableText text={relay.pubkey} buttonAlignment="right" />
                        </div>
                    )}
                </div>
                <div className="d-flex flex-row justify-content-end align-items-start">
                    <div className="text-muted"><a href={`${pages.getInspector()}?relayUrl=${relay.url}`}>Inspect</a></div>
                </div>
            </div>
            <Card.Body className="pt-0">
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className="mr-4">Payment Details</div>
                            {relay.payment_required ? (
                                <CurrencyBitcoin size={25} title="payment required" />
                            ): (
                                <X size={30} title="payment NOT required"/>
                            )}
                        </Accordion.Header>
                        <Accordion.Body>
                            {relay.payment_required ? (
                                <div>
                                    <div>
                                        {relay.payments_url ? (
                                            <a href={relay.payments_url} target="_blank">Payment instructions</a>
                                        ) : (
                                            <div>Payment Instructions Unknown</div>
                                        )}
                                    </div>
                                    <div>
                                        {relay.admission_fees_sats && (
                                            <p>Fee to join (sats): {relay.admission_fees_sats}</p>
                                        )}
                                    </div>
                                    <div>
                                        {relay.publication_fees_sats && (
                                            <p>Fee per publication (sats): {relay.publication_fees_sats}</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted">No payment required</div>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className="mr-4">Community Preferences</div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div>
                                {hasCommunityPreferences ? (
                                    <div>
                                        {relay.posting_policy ? (
                                            <a href={relay.posting_policy} target="_blank">Posting Policy</a>
                                        ) : (
                                            <div>Posting Policy: Unknown</div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div>
                                            Community Preferences not set.
                                        </div>
                                        <div>
                                            Set Community Preferences to attract users based on location, interest or existing community identity. <a href={COMMUNITY_PREFERNCES_NIP} target="_blank">Learn more</a>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className="d-flex flex-row justify-content-start align-items-center">
                                <div className="me-2">Status</div>
                                <div>
                                    <StatusIndicator status={relay.last_update_success ? "active" : "inactive"} />
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex flew-row justify-content-start align-items-center">
                                <div className="font-weight-bold me-2">Is active:</div>
                                <div>
                                    {relay.last_update_success ? 'Yes' : 'No'}
                                </div>
                            </div>
                            {relay.tracked_since && (
                                <div className="d-flex flew-row justify-content-start align-items-center">
                                    <div className="font-weight-bold me-2">Tracking Since:</div>
                                    <div>
                                        {humanReadableDateFromISO(relay.tracked_since)}
                                    </div>
                                </div>
                            )}
                            {relay.last_metadata_update && (
                                <div className="d-flex flew-row justify-content-start align-items-center">
                                    <div className="font-weight-bold me-2">Last Metadata Update:</div>
                                    <div>
                                        {humanReadableDateTimeFromISO(relay.last_metadata_update)}
                                    </div>
                                </div>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Relay Software</Accordion.Header>
                        <Accordion.Body>
                            {relay.software && (
                                <div className="d-flex flew-row justify-content-start align-items-center">
                                    <div className="font-weight-bold me-2">Software:</div>
                                    <div>
                                        {relay.software}
                                    </div>
                                </div>
                            )}
                            {relay.supported_nips && (
                                <div className="d-flex flew-row justify-content-start align-items-center">
                                    <div className="font-weight-bold me-2">Support NIPs:</div>
                                    <div>
                                        {getSupportedNipsDisplay(relay.supported_nips)}
                                    </div>
                                </div>
                            )}
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
