import {
    Container,
    Button,
    Card,
    Table,
    Toast,
    ToastContainer,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import {
    getAndSaveUserInfo,
    createAndPublishRelayList,
    getAndSaveUserProfile,
} from "../../utils/nostrUserManagement";
import {
    getPreferredRelays,
    addPreferredRelay,
    removePreferredRelay,
    READ_MARKER,
    WRITE_MARKER,
} from "../../utils/sessionStorage";
import { COMMON_FREE_RELAYS } from "../../config/consts"
import LoadingIndicator from "../../components/common/loadingIndicator";
import { getUserRelays } from "../../utils/getRelays";
import CopyableText from "../../components/common/copyableText";
import { PreferredRelay } from "../../types/sessionStorage";


export default function MyRelaysPage() {

    const [user, setUser] = useState<any>(null);
    const [preferredRelays, setPreferredRelays] = useState<PreferredRelay[]>([]);
    const [extensionRecommendedRelays, setExtensionRecommendedRelays] = useState<string[]>([]);
    const [queriedUserRelays, setQueriedUserRelays] = useState<PreferredRelay[]>([]);
    const [loadingUser, setLoadingUser] = useState<boolean>(false);
    const [loadingUserProfile, setLoadingUserProfile] = useState<boolean>(false);
    const [publishingRelayList, setPublishingRelayList] = useState<boolean>(false);
    const [loadingUserRelays, setLoadingUserRelays] = useState<boolean>(false);
    const [successfullySavedRelays, setSuccessfullySavedRelays] = useState<boolean>(false);
    const [failedSavedRelays, setFailedSavedRelays] = useState<boolean>(false);

    const COMMON_FREE_RELAYS_WITH_WRITE_MARKER = COMMON_FREE_RELAYS.map((relay: string) => {
        return {
            url: relay,
        }
    })

    async function initiateLogin() {
        setLoadingUser(true);
        const userData = await getAndSaveUserInfo();
        setUser(userData);
        setLoadingUser(false);

        setLoadingUserProfile(true);
        setLoadingUserRelays(true);

        try {
            const fullUserProfile = await getAndSaveUserProfile(userData.pubkey, []);
            setUser(fullUserProfile)
        } catch (error: any) {
            console.error("Failed to get and save user profile", error);
        }
        setLoadingUserProfile(false);

        try {
            const relaysUserWantsToQuery = [...userData.relayUrls];
            const usersExistingRelays = await getUserRelays(userData.pubkey, relaysUserWantsToQuery);
            console.log("users existing relays", usersExistingRelays)
            setQueriedUserRelays(usersExistingRelays)
        } catch (error: any) {
            console.error("Failed to get user relays", error);
        }
        setLoadingUserRelays(false);
    }

    function addAllToPreferredRealys(relaysToAdd: PreferredRelay[]) {
        relaysToAdd.forEach((relay: PreferredRelay) => {
            addPreferredRelay(relay.url, relay.marker);
        });
        setPreferredRelays(getPreferredRelays());
    }

    function addPreferredRelayToStorage(relay: PreferredRelay) {
        addPreferredRelay(relay.url, relay.marker)
        setPreferredRelays(getPreferredRelays());
    }

    function removePreferredRelayFromStorage(relayUrl: string) {
        removePreferredRelay(relayUrl)
        setPreferredRelays(getPreferredRelays());
    }

    function inPreferredRelays(relayUrl: string) {
        let contains = false;
        preferredRelays.forEach((relay: PreferredRelay) => {
          if (relay.url === relayUrl) {
            contains = true;
          }
        });
        return contains;
      }


    useEffect(() => {
        setPreferredRelays(getPreferredRelays());
        setExtensionRecommendedRelays(user?.relayUrls);
    }, [user]);

    async function saveAndPublishPreferredRelaysList() {
        setPublishingRelayList(true)
        let success = true;
        try {
            await createAndPublishRelayList(preferredRelays, user)
        } catch (error: any) {
            console.error("Failed to publish preferred relays list", error);
            success = false;
        }
        setPublishingRelayList(false)
        if (success) {
            showSuccessSavedRelays();
        } else {
            showFailedSavedRelays();
        }
    }

    function showSuccessSavedRelays() {
        setSuccessfullySavedRelays(true)
        setTimeout(() => {
            setSuccessfullySavedRelays(false)
        }, 3000);
    }

    function showFailedSavedRelays() {
        setFailedSavedRelays(true)
        setTimeout(() => {
            setFailedSavedRelays(false)
        }, 3000);
    }

    return (
        <div>
            <Container>
                {successfullySavedRelays && (
                    <ToastContainer
                        className="p-3"
                        position="top-center"
                        style={{ zIndex: 1 }}
                        >
                        <Toast bg="success">
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">Relay Lists</strong>
                            </Toast.Header>
                            <Toast.Body className="text-white">Successfully published preferred relay list.</Toast.Body>
                        </Toast>
                    </ToastContainer>
                )}
                {failedSavedRelays && (
                    <ToastContainer
                        className="p-3"
                        position="top-center"
                        style={{ zIndex: 1 }}
                        >
                        <Toast bg="danger">
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">Relay Lists</strong>
                            </Toast.Header>
                            <Toast.Body className="text-white">Failed to publish preferred relay list.</Toast.Body>
                        </Toast>
                    </ToastContainer>
                )}
                {loadingUser ? <LoadingIndicator /> : (
                    <>
                        {(user?.pubkey) ? (
                            <Card style={{ padding: "2rem", marginBottom: "2rem", marginTop: "2rem"}}>
                                <h2>User Info</h2>
                                <div><strong>pubkey: </strong> {user.pubkey}</div>
                                <div><strong>npub: </strong> {user.npub}</div>
                                {loadingUserProfile? <LoadingIndicator /> : (
                                    <div>
                                        {user.profile.name ? (
                                            <div><strong>name: </strong> {user.profile.name}</div>
                                        ) : (
                                            <div><strong>name: </strong> Unknown</div>
                                        )}
                                        {user.profile.about && (
                                            <div><strong>about: </strong> {user.profile.about}</div>
                                        )}
                                        {user.profile.nip05 && (
                                            <div><strong>nip05: </strong> {user.profile.nip05}</div>
                                        )}
                                        {user.profile.website && (
                                            <div><strong>website: </strong> {user.profile.website}</div>
                                        )}
                                    </div>
                                )}
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
                                    <br/>
                                    Saving and publishing your preferred realy list will publish a relay list following the pattern of <a href="https://github.com/nostr-protocol/nips/blob/master/65.md" target="_blank">NIP 65</a>.
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
                                                    {preferredRelays.map((relay: PreferredRelay) => (
                                                        <tr key={relay.url}>
                                                            <td>
                                                                <CopyableText text={relay.url} />
                                                            </td>
                                                            <td>
                                                                <Button onClick={() => removePreferredRelayFromStorage(relay.url)} variant="danger">
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
                                                        <Button
                                                            onClick={saveAndPublishPreferredRelaysList}
                                                            variant="success"
                                                        >
                                                            Save and publish preferred relays list
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    disabled
                                                    title="not logged in"
                                                >
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
                                    <p>
                                        These are the relays that we found you set as preferred on common relays following the pattern of <a href="https://github.com/nostr-protocol/nips/blob/master/65.md" target="_blank">NIP 65</a>
                                    </p>
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
                                                                {queriedUserRelays.map((relay: PreferredRelay) => (
                                                                    <tr key={relay.url}>
                                                                        <td>
                                                                            <CopyableText text={relay.url} />
                                                                        </td>
                                                                        <td>
                                                                            {inPreferredRelays(relay.url) ? (
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
                            <div style={{marginBottom: "2rem"}}>
                                <h2>Common relays being used</h2>
                                <p>
                                    These are the "common relays" we are using to find and publish your preferred relays.
                                    If your client uses these relays to find your account and seed your profile AND they use the NIP 65 pattern for sensing and saving your preferred relays you'll be able to manage your relays via Relay.Guide.
                                </p>
                                <Button onClick={() => addAllToPreferredRealys(COMMON_FREE_RELAYS_WITH_WRITE_MARKER)}>
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
                                        {COMMON_FREE_RELAYS_WITH_WRITE_MARKER.map((relay: PreferredRelay) => (
                                            <tr key={relay.url}>
                                                <td>
                                                    <CopyableText text={relay.url} />
                                                </td>
                                                <td>
                                                    {inPreferredRelays(relay.url) ? (
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
                            </div>
                        </Card>
                    </>
                )}
            </Container>
        </div>
    );
}
