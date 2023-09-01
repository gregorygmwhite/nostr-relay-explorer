import { COMMON_FREE_RELAYS } from "../config/consts";
import { relayInit } from 'nostr-tools'
import { EventKind } from "../types/event";
import { validateRelayUrl } from "./relayUtils";


export async function getUserRelays(relayUrls: string[], userPubkey: string) {
    relayUrls = [...relayUrls, ...COMMON_FREE_RELAYS];
    const nip65Events = await getNIP65RelayListEventsFromRelays(relayUrls, userPubkey);
    console.log("nip65Events", nip65Events)

    let userRelays: string[] = [];
    nip65Events.forEach((event: any) => {
        let tags = event.tags;
        for (const tag of tags) {
            if (tag[0] === "r") {
                const relayUrl = tag[1];
                validateRelayUrl(relayUrl);
                userRelays.push(relayUrl);
            }
        }
    });

    // deduplicate userRelays
    const uniqueUserRelays = Array.from(new Set(userRelays));
    return uniqueUserRelays;
}

async function getNIP65RelayListEventsFromRelays(relays: string[], userPubkey: string) {
    try {
        const promises = relays.map(relay => retrieveNIP65RelayListFromRelay(relay, userPubkey));
        const allResults = await Promise.all(promises);
        return allResults.flat();
    } catch (error) {
        console.error("Error querying relays:", error);
        throw error;
    }
}

function retrieveNIP65RelayListFromRelay(relayUrl: string, userPubkey: string) {
    return new Promise(async (resolve, reject) => { // Made the function async
        const relay = relayInit(relayUrl)
        relay.on('connect', () => {
            console.log(`connected to ${relay.url}`);
        })
        relay.on('error', () => {
            const errorMessage = `failed to connect to ${relay.url}`
            console.log(errorMessage);
            reject(errorMessage);
        })

        try {
            await relay.connect();

            let events = await relay.list([
                {
                    kinds: [EventKind.RelayListMetadata],
                    authors: [userPubkey],
                    limit: 1,
                }
            ]);

            console.log(`events from ${relay.url}`, events)

            relay.close();
            resolve(events);
        } catch (err) {
            reject(err);
        }
    });
}
