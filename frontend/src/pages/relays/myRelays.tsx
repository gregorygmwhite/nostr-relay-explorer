import {
    Container,
    Button,
    Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { getAndSaveUserInfo } from "../../utils/nostrUserManagement";
import { getUserInfo, getPreferredRelays } from "../../utils/sessionStorage";
import LoadingIndicator from "../../components/common/loadingIndicator";
import { getUserRelays } from "../../utils/getRelays";

const JB55_PUBKEY = "npub1xtscya34g58tk0z605fvr788k263gsu6cy9x0mhnm87echrgufzsevkk5s"
const GREG_PUBKEY = "npub1r3fwhjpx2njy87f9qxmapjn9neutwh7aeww95e03drkfg45cey4qgl7ex2"
const RANDOM_PUBKEY = "80fde8b785a59ad2d3b2fac0053aa3fa6ff970db5e574d67c82910f927639461"

export default function MyRelaysPage() {

    const [user, setUser] = useState<any>(null);
    const [preferredRelays, setPreferredRelays] = useState<string[]>([]);
    const [extensionRecommendedRelays, setExtensionRecommendedRelays] = useState<string[]>([]);
    const [queriedUserRelays, setQueriedUserRelays] = useState<string[]>([]);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);
    const [loadingUserRelays, setLoadingUserRelays] = useState<boolean>(false);

    async function initiateLogin() {
        setLoadingUser(true);
        const userData = await getAndSaveUserInfo();
        setUser(userData);
        setLoadingUser(false);
        setLoadingUserRelays(true);
        const relaysUserWantsToQuery = [...userData.relayUrls];
        // const usersExistingRelays = await getUserRelays(relaysUserWantsToQuery, userData.pubkey);
        const usersExistingRelays = await getUserRelays(relaysUserWantsToQuery, RANDOM_PUBKEY);
        setQueriedUserRelays(usersExistingRelays)
        setLoadingUserRelays(false);
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
                {loadingUser ? <LoadingIndicator /> : (
                    <>
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
                                    <h2>Recommendations based on previous settings</h2>
                                    <p>These are the relays that we found you set as preferred on common relays</p>
                                    <div style={{ marginTop: "1rem"}} >
                                        {loadingUserRelays ? <LoadingIndicator /> : (
                                            <>
                                                {queriedUserRelays?.length > 0 ? (
                                                    <ul>
                                                        {queriedUserRelays.map((relay: string) => <li key={relay}>{relay}</li>)}
                                                    </ul>
                                                ) : (
                                                    <h5>No relay recommendations found on commonly used relays</h5>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                            </Card>
                        )}
                    </>
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
