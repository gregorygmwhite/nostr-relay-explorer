import { COMMON_FREE_RELAYS } from "../config/consts";
import { relayInit } from 'nostr-tools'
import { EventKind } from "../types/event";
import { validateRelayUrl } from "./relayUtils";
import {
    SimplePool,
} from 'nostr-tools'


export async function getUserRelays(pubkey: string, relayUrls: string[]) {
    return await getUsersNIP65Relays(pubkey, relayUrls);
}

async function getUsersNIP65Relays(pubkey: string, relayUrls: string[]) {
    let relays: any[] = []
    let kind10002Events = await getKind10002EventsForPubkey(pubkey, relayUrls);
    console.log("kind10002Events", kind10002Events)

    if (kind10002Events.length === 0) {
        return relays;
    }

    let latestEvent = kind10002Events[0];
    kind10002Events.forEach((event: any) => {
        if (latestEvent.created_at < event.created_at) {
            latestEvent = event;
        }
    });

    console.log("latestKind10002Event", latestEvent)
    const tags = latestEvent.tags
    for (const tag of tags) {
        if (tag[0] === "r") {
            const relayUrl = tag[1];
            validateRelayUrl(relayUrl);
            const marker = tag[2];
            const relay = {
                url: relayUrl,
                marker: marker,
            }
            relays.push(relay);
        }
    }
    return relays;
}

async function getKind10002EventsForPubkey(pubkey: string, relayUrls: string[]) {

    const pool = new SimplePool()

    let relays = [...COMMON_FREE_RELAYS, ...relayUrls]

    let events = await pool.list(relays,
        [
            {
                kinds: [EventKind.RelayListMetadata],
                authors: [pubkey],
                limit: 1,
            }
        ]
    )

    pool.close(relays)

    return events;
}

