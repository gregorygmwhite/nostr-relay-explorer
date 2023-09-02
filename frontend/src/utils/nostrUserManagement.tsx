import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
import { EventKind }  from "../types/event";
import { getUserInfo, updateUserInfo } from "./sessionStorage";
import { COMMON_FREE_RELAYS } from "../config/consts"
import { validateRelayUrl } from "./relayUtils";
import { nip19 } from 'nostr-tools'


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
    const npub = user.npub;
    const hexpubkey = nip19.decode(user.npub).data;
    const userData = {
        pubkey: hexpubkey,
        npub: npub,
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
    await event.publish().catch((error: any) => {
        console.log("error publishing relay list event", error)
    })
    console.log("finished publishing relay list event")
}

function transformRelayListIntoEventTags(relays: string[]) {
    const eventTags = relays.map((relayUrl) => {
        validateRelayUrl(relayUrl); // throws an error if invalid
        return [
            "r", relayUrl
        ];
    });
    return eventTags;
}

export async function getUserProfile(userPubKey: any) {
    console.log("fetching user profile")

    const ndk = new NDK({
        explicitRelayUrls: COMMON_FREE_RELAYS,
    });
    const userInfo = ndk.getUser({
        hexpubkey: userPubKey,
    });
    console.log("found user", userInfo)
    const profileInfo = await userInfo.fetchProfile();

    console.log("fetched user profile", profileInfo)

    return userInfo.profile;
}

