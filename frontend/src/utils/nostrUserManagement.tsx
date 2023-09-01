import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
import { EventKind }  from "../types/event";
import { getUserInfo, updateUserInfo } from "./sessionStorage";
import { COMMON_FREE_RELAYS } from "../config/consts"
import { validateRelayUrl } from "./relayUtils";


function createNDKEvent(extraRelays: string[]) {
    const nip07signer = new NDKNip07Signer();
    const ndk = new NDK({
        signer: nip07signer,
        explicitRelayUrls: [...COMMON_FREE_RELAYS, ...extraRelays],
    });
    const event = new NDKEvent(ndk);
    return event;
}

export async function getAndSaveUserInfo() {
    const nip07signer = new NDKNip07Signer();
    const ndk = new NDK({
        signer: nip07signer,
        explicitRelayUrls: COMMON_FREE_RELAYS,
    });
    if(!ndk.signer) {
        throw new Error("Internal error, signing extension not connected.");
    }
    const user = await ndk.signer.blockUntilReady();
    user.ndk = ndk;
    // const relayList = await user.relayList();
    // const profileInfo = await user.fetchProfile();
    user.fetchProfile();
    user.relayList();

    const userData = {
        pubkey: user.npub,
        profile: user.profile,
        relayUrls: user.relayUrls, // recommended from the login extension
    }
    updateUserInfo(userData);
    return userData;
}


export async function createAndPublishRelayList(relays: string[], user: any) {
    if (!user && !user.pubkey) {
        user = await getAndSaveUserInfo();
    }

    const event = createNDKEvent(relays);
    event.kind = EventKind.RelayListMetadata;
    event.content = "";
    event.tags = transformRelayListIntoEventTags(relays);
    console.log("publishing relay list event", event)
    event.publish();
}

function transformRelayListIntoEventTags(relays: string[]) {
    const eventTags = relays.map((relayUrl) => {
        validateRelayUrl(relayUrl); // throws an error if invalid
        return [
            "r", relayUrl, "write"
        ];
    });
    return eventTags;
}


