import {
    Container,
    Button,
    Card,
    Table
} from "react-bootstrap";
import { useState, useEffect } from "react";
import {
    getAndSaveUserInfo,
    createAndPublishRelayList,
} from "../../utils/nostrUserManagement";
import {
    getUserInfo,
    getPreferredRelays,
    addPreferredRelay,
    removePreferredRelay,
    updateUserInfo,
} from "../../utils/sessionStorage";
import LoadingIndicator from "../../components/common/loadingIndicator";
import { getUserRelays } from "../../utils/getRelays";
import CopyableText from "../../components/common/copyableText";


export default function MyRelaysPage() {

    const [user, setUser] = useState<any>(null);
    const [preferredRelays, setPreferredRelays] = useState<string[]>([]);
    const [extensionRecommendedRelays, setExtensionRecommendedRelays] = useState<string[]>([]);
    const [queriedUserRelays, setQueriedUserRelays] = useState<string[]>([]);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);
    const [loadingUserProfile, setLoadingUserProfile] = useState<boolean>(false);
    const [publishingRelayList, setPublishingRelayList] = useState<boolean>(false);
    const [loadingUserRelays, setLoadingUserRelays] = useState<boolean>(false);

    async function initiateLogin() {
        setLoadingUser(true);
        const userData = await getAndSaveUserInfo();
        setUser(userData);
        setLoadingUser(false);

        setLoadingUserRelays(true);
        const relaysUserWantsToQuery = [...userData.relayUrls];
        const usersExistingRelays = await getUserRelays(relaysUserWantsToQuery, userData.pubkey);
        setQueriedUserRelays(usersExistingRelays)
        setLoadingUserRelays(false);

        // setLoadingUserProfile(true);
        // const fullUserProfile = await getUserProfile(userData.pubkey);
        // let updatedUserData = {...getUserInfo()}
        // updatedUserData.profile = fullUserProfile;
        // updateUserInfo(updatedUserData);
        // setUser(updatedUserData)
        // setLoadingUserProfile(false);
    }

    function addAllToPreferredRealys(relaysToAdd: string[]) {
        relaysToAdd.forEach((relay: string) => {
            addPreferredRelay(relay);
        });
        setPreferredRelays(getPreferredRelays());
    }

    function addPreferredRelayToStorage(relayUrl: string) {
        addPreferredRelay(relayUrl)
        setPreferredRelays(getPreferredRelays());
    }

    function removePreferredRelayFromStorage(relayUrl: string) {
        removePreferredRelay(relayUrl)
        setPreferredRelays(getPreferredRelays());
    }

    useEffect(() => {
        setPreferredRelays(getPreferredRelays());
        setExtensionRecommendedRelays(user?.relayUrls);
    }, [user]);

    async function saveAndPublishPreferredRelaysList() {
        setPublishingRelayList(true)
        await createAndPublishRelayList(preferredRelays, user)
        setPublishingRelayList(false)
    }

    return (
        <div>
            <Container>
                {loadingUser ? <LoadingIndicator /> : (
                    <>
                        {(user?.pubkey) ? (
                            <Card style={{ padding: "2rem", marginBottom: "2rem" }}>
                                <h2>User Info</h2>
                                <div><strong>pubkey: </strong> {user.pubkey}</div>
                                <div><strong>npub: </strong> {user.npub}</div>
                                {/* <code><pre>{JSON.stringify(user, null, 2)}</pre></code> */}
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

                        <Card style={{ padding: "2rem", marginBottom: "2rem" }}>
                            <div style={{marginBottom: "2rem"}}>
                                <h2>Selected Preferred Relays</h2>
                                <p>
                                    These are the relays you've selected via Relay.Guide
                                    <br/>
                                    You can save this list as your new preferred list of relays, and advertise it so clients can start off with your preferred relays.
                                </p>
                                <div style={{ marginTop: "1rem"}} >
                                    {preferredRelays?.length > 0 ? (
                                        <>
                                            <Table hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Relay URL</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {preferredRelays.map((relay: string) => (
                                                        <tr key={relay}>
                                                            <td>
                                                                <CopyableText text={relay} />
                                                            </td>
                                                            <td>
                                                                <Button onClick={() => removePreferredRelayFromStorage(relay)} variant="danger">
                                                                    Remove
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            {user?.pubkey ? (
                                                <>
                                                    {publishingRelayList ? <LoadingIndicator /> : (
                                                        <Button onClick={saveAndPublishPreferredRelaysList} variant="success">
                                                            Save and publish preferred relays list
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <Button variant="success" disabled title="not logged in">
                                                    Save and publish preferred relays list
                                                </Button>
                                            )}

                                        </>
                                    ) : (
                                        <h5>No relays selected</h5>
                                    )}
                                </div>
                            </div>
                            {(user?.pubkey) && (
                                <div style={{marginBottom: "2rem"}}>
                                    <h2>Recommendations based on previous settings</h2>
                                    <p>These are the relays that we found you set as preferred on common relays</p>
                                    <div style={{ marginTop: "1rem"}} >
                                        {loadingUserRelays ? <LoadingIndicator /> : (
                                            <>
                                                {queriedUserRelays?.length > 0 ? (
                                                    <>
                                                        <Button onClick={() => addAllToPreferredRealys(queriedUserRelays)}>
                                                            Add all to preferred relays
                                                        </Button>
                                                        <Table hover responsive>
                                                            <thead>
                                                                <tr>
                                                                <th>Relay URL</th>
                                                                <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {queriedUserRelays.map((relay: string) => (
                                                                    <tr key={relay}>
                                                                        <td>
                                                                            <CopyableText text={relay} />
                                                                        </td>
                                                                        <td>
                                                                            {preferredRelays.includes(relay) ? (
                                                                                <Button disabled>
                                                                                    Add to preferred relays
                                                                                </Button>
                                                                            ): (
                                                                                <Button onClick={() => addPreferredRelayToStorage(relay)}>
                                                                                    Add to preferred relays
                                                                                </Button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                ) : (
                                                    <h5>No relay recommendations found on commonly used relays</h5>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>
                    </>
                )}
            </Container>
        </div>
    );
}
