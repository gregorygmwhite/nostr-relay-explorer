import { EventKind }  from "../types/event";
import { getUserInfo, updateUserInfo } from "./sessionStorage";
import { COMMON_FREE_RELAYS } from "../config/consts"
import { validateRelayUrl } from "./relayUtils";
import {
    validateEvent,
    verifySignature,
    getEventHash,
    nip19,
    SimplePool,
} from 'nostr-tools'

import {
    getPublicKey as getPublicKeyViaNip07,
    generateEventSignature as generateEventSignatureViaNip07,
} from "./nip07"


function createBaseEvent(pubkey: string) {
    let event = {
        id: null as any,
        sig: null as any,
        kind: null as any,
        created_at: Math.floor(Date.now() / 1000),
        tags: [] as any[],
        content: '',
        pubkey: pubkey,
    }
    return event;
}

function finalizeEvent(event: any, signature: string) {
    event.sig = signature;
    event.id = getEventHash(event);
    let ok = validateEvent(event)
    let veryOk = verifySignature(event)
    if (!ok || !veryOk) {
        throw new Error("Invalid event");
    }
    return event;
}


export async function getAndSaveUserInfo() {
    const pubkey = await getPublicKeyViaNip07();
    const npub = nip19.npubEncode(pubkey);
    const userData = {
        pubkey: pubkey,
        npub: npub,
        profile: {},
        relayUrls: [],
    }
    updateUserInfo(userData);
    return userData;
}

export async function createAndPublishRelayList(relays: string[], user: any) {
    if(!user && !user.pubkey) {
        user = await getAndSaveUserInfo();
    }

    const NIP65Event = await createNIP65Event(relays, user);

    // TODO: find a way to publish to user's preferred relays too
    // need a way to sense if those relays are public or not
    const relaysToPublishTo = COMMON_FREE_RELAYS;  // can only publish to public relays
    await publishToMultipleRelays(NIP65Event, relaysToPublishTo);
    return NIP65Event;
}

async function createNIP65Event(relays: string[], user: any ) {
    let event = createBaseEvent(user.pubkey);
    event.kind = EventKind.RelayListMetadata;
    event.content = "";
    event.tags = transformRelayListIntoEventTags(relays);
    const signature = await generateEventSignatureViaNip07(event);
    const signedEvent = finalizeEvent(event, signature);
    return signedEvent;
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

export async function publishToMultipleRelays(event: any, relays: string[]) {
    const pool = new SimplePool()

    let pubs = pool.publish(relays, event)
    await Promise.all(pubs).catch((error: any) => {
        console.log("error publishing event to relays", event, relays, error)
        throw new Error("Error publishing  event")
    })

    pool.close(relays)
}

export async function getAndSaveUserProfile(pubkey: string, relayUrls: string[]) {
    const profileInfo = await getUserProfile(pubkey, relayUrls);
    const userData = getUserInfo();
    userData.profile = profileInfo;
    updateUserInfo(userData);
    return userData;
}

export async function getUserProfile(pubkey: string, relayUrls: string[]) {
    let profileInfo = {}
    let kind0Events = await getKind0EventsForPubkey(pubkey, relayUrls);
    console.log("kind0Events", kind0Events)

    if (kind0Events.length === 0) {
        return profileInfo;
    }

    let latestEvent = kind0Events[0];
    kind0Events.forEach((event: any) => {
        if (latestEvent.created_at < event.created_at) {
            latestEvent = event;
        }
    });

    console.log("latestKind0Event", latestEvent)

    profileInfo = JSON.parse(latestEvent.content);

    return profileInfo;
}

async function getKind0EventsForPubkey(pubkey: string, relayUrls: string[]) {
    const pool = new SimplePool()

    let relays = [...COMMON_FREE_RELAYS, ...relayUrls]

    let events = await pool.list(relays,
        [
            {
                kinds: [0],
                authors: [pubkey],
            }
        ]
    )

    pool.close(relays)

    return events;
}
