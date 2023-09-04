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
    // create event
    const NIP65Event = await createNIP65Event(relays, user);

    // publish event
    const relaysToPublishTo = [...user.relayUrls, ...COMMON_FREE_RELAYS];
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
