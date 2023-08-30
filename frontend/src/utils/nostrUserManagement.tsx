import NDK, { NDKNip07Signer, NDKEvent } from "@nostr-dev-kit/ndk";
import { EventKind }  from "../types/event";
import { getUserInfo, updateUserInfo } from "./sessionStorage";

export const COMMON_FREE_RELAYS = [
    "wss://relay.primal.net",
    "wss://nos.lol",
    "wss://relay.nostr.band",
    "wss://relay.damus.io",
    // "wss://nostr.wine", // paid
    "wss://relayable.org",
    "wss://saltivka.org",
    "wss://nostr-pub.wellorder.net",
    "wss://nostr.bitcoiner.social",
]

function createNDKEvent() {
    const nip07signer = new NDKNip07Signer();
    const ndk = new NDK({
        signer: nip07signer,
        explicitRelayUrls: COMMON_FREE_RELAYS,
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
    user.fetchProfile();
    debugger;
    const userData = {
        pubkey: user.npub,
    }
    updateUserInfo(userData);
    return userData;
}

// export async function getAndSaveUserInfo() {
//     return new Promise(async (resolve, reject) => {
//         const nip07signer = new NDKNip07Signer();
//         const ndk = new NDK({
//             signer: nip07signer,
//             explicitRelayUrls: COMMON_FREE_RELAYS,
//         });
//         nip07signer.user().then((user: any) => {
//             if (!!user.npub) {
//                 console.log("Permission granted to read public key:", user.npub);
//                 const userData = {
//                     pubkey: user.npub,
//                 }
//                 updateUserInfo(userData);
//                 resolve(userData); // Resolve the promise with userData
//             } else {
//                 reject(new Error("User didn't grant permission to necessary data."));
//             }
//         }).catch((err: any) => {
//             reject(err); // Reject the promise if there's any error
//         });
//     });
// }


export async function createAndPublishRelayList(relays: string[]) {
    let user = JSON.parse(getUserInfo());

    if (!user && !user.pubkey) {
        user = await getAndSaveUserInfo();
    }

    const event = createNDKEvent();
    event.kind = EventKind.RelayListMetadata;
    event.content = "";
    event.pubkey = user.pubkey;
    event.tags = transformRelayListIntoEventTags(relays);

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

function validateRelayUrl(relayUrl: string) {
    if (!relayUrl) {
        throw new Error("Relay URL cannot be empty");
    }
    if (!relayUrl.startsWith("wss://") && !relayUrl.startsWith("ws://")) {
        throw new Error("Relay URLs must start with wss:// or ws://");
    }
}
