import {
    Container,
    Button,
    Accordion,
} from "react-bootstrap";
import pages from "../config/pages";

export default function HomePage() {

    const NOSTRICH_PURPLE = "#ae47f4"

    return (
        <div>
            <Container
                fluid
                className="text-center"
                style={{
                    paddingTop: "10rem",
                    paddingBottom: "10rem",
                    backgroundColor: NOSTRICH_PURPLE
                }}
            >
                <Container style={{ maxWidth: "82.5rem"}}>
                    <div className="h1 text-light">Helping Nostriches Find Relays</div>
                    <Button href={pages.getRelaySearch()} size="lg" variant="dark" className="mt-4">
                        Search Relays
                    </Button>
                </Container>
            </Container>

            <Container fluid className="bg-dark text-white" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
                <Container style={{ maxWidth: "82.5rem"}}>
                    <div className="d-flex flex-row justify-content-around align-content-center flex-wrap text-center">
                        <div className="text-center mt-5 mb-5" style={{ width: "20rem"}}>
                            <div className="d-flex align-items-center flex-column" style={{ minHeight: "12rem"}}>
                                <div className="h3">Search Relays</div>
                                <div className="mt-3">Search for relays based on supported features, paid/public, or other metadata.</div>
                                <Button href={pages.getRelaySearch()} className="mt-auto" variant="light">
                                    Search
                                </Button>
                            </div>
                        </div>
                        <div className="text-center mt-5 mb-5" style={{ width: "20rem"}}>
                            <div className="d-flex align-items-center flex-column" style={{ minHeight: "12rem"}}>
                                <div className="h3">
                                    Relay Lists
                                </div>
                                <div className="mt-3">Manage your preferred relay list so clients start out knowing your preference.</div>
                                <Button href={pages.getMyRelays()} className="mt-auto" variant="light">Manage</Button>
                            </div>
                        </div>
                        <div className="text-center mt-5 mb-5" style={{ width: "20rem"}}>
                            <div className="d-flex align-items-center flex-column" style={{ minHeight: "12rem"}}>
                                <div className="h3">Inspect Relays</div>
                                <div className="mt-3">Query for the raw events on a specific relay. Use to diagnose issues on a relay or see if your events are making it to a relay.</div>
                                <Button href={pages.getInspector()} className="mt-auto" variant="light">
                                    Inspect
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </Container>

            <Container fluid className="bg-light" style={{ paddingTop: "8rem", paddingBottom: "8rem" }}>
                <Container style={{ maxWidth: "82.5rem"}}>
                    <div className="h2 text-center">Nostr basics</div>
                    <Accordion className="mt-5">
                        <Accordion.Item eventKey="0" className="mt-2">
                            <Accordion.Header>
                                <div className="h4">What is Nostr?</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                Nostr is a decentralized social media protocol. <a href="https://nostr.com" target="_blank">Nostr.com has a great introduction</a>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="mt-2">
                            <Accordion.Header>
                                <div className="h4">What are Nostr clients?</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                Nostr clients are the websites and applications that allow users to interact with the Nostr protocol. <a href="https://nostr.com/clients" target="_blank">Nostr.com</a>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2" className="mt-2">
                            <Accordion.Header>
                                <div className="h4">What are Nostr relays?</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                Nostr relays are where the data is stored when users create content using the Nostr protocol. <a href="https://nostr.com/relays" target="_blank">Nostr.com</a>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3" className="mt-2">
                            <Accordion.Header>
                                <div className="h4">What are Nostr events?</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                Events are a general term for the data created by interacting with the Nostr protocol. Events can be posts, comments, likes, follows, updates to your user's profile picture, etc. <a href="https://nostr.com/the-protocol/events" target="_blank">Nostr.com</a>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4" className="mt-2">
                            <Accordion.Header>
                                <div className="h4">What is a Nostrich?</div>
                            </Accordion.Header>
                            <Accordion.Body>
                                The unofficial mascot of Nostr is the humble ostrich, folks in the Nostr community often refer to themselves as Nostriches.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Container>
            </Container>
        </div>
    );
}
