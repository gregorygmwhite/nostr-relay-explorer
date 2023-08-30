import {
    Container,
    Button,
    Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { getAndSaveUserInfo } from "../../utils/nostrUserManagement";
import { getUserInfo, getPreferredRelays } from "../../utils/sessionStorage";
import LoadingIndicator from "../../components/common/loadingIndicator";

export default function MyRelaysPage() {

    const [user, setUser] = useState<any>(null);
    const [preferredRelays, setPreferredRelays] = useState<string[]>([]);
    const [extensionRecommendedRelays, setExtensionRecommendedRelays] = useState<string[]>([]);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);

    async function initiateLogin() {
        setLoadingUser(true);
        const userData = await getAndSaveUserInfo();
        setUser(userData);
        setLoadingUser(false);
    }

    function retrieveStoredUser() {
        const userData = getUserInfo();
        setUser(userData);
    }

    useEffect(() => {
        setPreferredRelays(getPreferredRelays());
        setExtensionRecommendedRelays(user?.relayUrls);
    }, [user]);

    return (
        <div>
            <Container>
                {loadingUser && <LoadingIndicator />}
                {(user?.pubkey) ? (
                    <Card style={{ padding: "2rem", marginBottom: "2rem" }}>
                        <h2>User Info</h2>
                        <p><strong>Pubkey: </strong> {user.pubkey}</p>
                        <code><pre>{JSON.stringify(user, null, 2)}</pre></code>
                    </Card>
                ) : (
                    <Card style={{ padding: "2rem", marginBottom: "2rem" }}>
                        <h2>Login to get started</h2>
                        <p>If you already have an nostr account, you'll be able to log int using your preferred NIP 07 extension.</p>
                        <h5>Recommended:</h5>
                        <ul>
                            <li><a href="https://chrome.google.com/webstore/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp" target="_blank">nos2x</a></li>
                            <li><a href="https://getalby.com/" target="_blank">Alby</a></li>
                        </ul>
                        <Button onClick={initiateLogin}>
                            Log In
                        </Button>
                    </Card>
                )}
                {(user?.pubkey) && (
                    <Card style={{ padding: "2rem", marginBottom: "2rem" }}>
                        <div style={{marginBottom: "2rem"}}>
                            <h2>Selected Preferred Relays</h2>
                            <p>These are the relays you've selected via Relay.Guide</p>
                            <div style={{ marginTop: "1rem"}} >
                                {preferredRelays?.length > 0 ? (
                                    <ul>
                                        {preferredRelays.map((relay: string) => <li>{relay}</li>)}
                                    </ul>
                                ) : (
                                    <h5>No relays selected</h5>
                                )}
                            </div>
                        </div>

                        <div style={{marginBottom: "2rem"}}>
                            <h2>Relays from login</h2>
                            <p>These are the relays that your login extension has said are your preferred</p>
                            <div style={{ marginTop: "1rem"}} >
                                {extensionRecommendedRelays?.length > 0 ? (
                                    <ul>
                                        {extensionRecommendedRelays.map((relay: string) => <li>{relay}</li>)}
                                    </ul>
                                ) : (
                                    <h5>No relays provided</h5>
                                )}
                            </div>
                        </div>

                    </Card>
                )}
                <Card style={{ padding: "2rem", marginBottom: "2rem" }}>
                    <Button onClick={retrieveStoredUser}>
                        Refresh user from DB
                    </Button>
                </Card>
            </Container>
        </div>
    );
}
