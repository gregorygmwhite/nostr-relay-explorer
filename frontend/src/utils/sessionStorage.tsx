import { PreferredRelay } from "../types/sessionStorage";

export const READ_MARKER = "read";
export const WRITE_MARKER = "write";

const USER_DATA_KEY = "user";
const RELAYS_DATA_KEY = "relays";

function storeItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function clearItem(key: string) {
    sessionStorage.removeItem(key);
}

function getItem(key: string) {
    const rawData = sessionStorage.getItem(key);
    if (rawData) {
        return JSON.parse(rawData);
    } else {
        return null;
    }
}

export function updateUserInfo(user: any) {
    const currentUserInfo = getItem(USER_DATA_KEY);
    clearItem(USER_DATA_KEY);
    storeItem(USER_DATA_KEY, user);
}

export function getUserInfo() {
    const userInfo = getItem(USER_DATA_KEY);
    return userInfo;
}

export function updatePreferredRelays(relays: PreferredRelay[]) {
    const currentPreferredRelays = getItem(RELAYS_DATA_KEY);
    clearItem(RELAYS_DATA_KEY);
    storeItem(RELAYS_DATA_KEY, relays);
}

export function addPreferredRelay(relayUrl: string, marker: string) {
    let preferredRelays = getItem(RELAYS_DATA_KEY);
    if (!preferredRelays) {
        preferredRelays = [];
    }
    if (!preferredRelaysContainsRelay(relayUrl)) {
        const relay = {
            url: relayUrl,
            marker: marker,
        }
        preferredRelays.push(relay);
    }
    updatePreferredRelays(preferredRelays);
}

function preferredRelaysContainsRelay(relayUrl: string) {
    const preferredRelays = getItem(RELAYS_DATA_KEY);
    if (!preferredRelays) {
        return false;
    }
    let contains = false;

    preferredRelays.forEach((relay: PreferredRelay) => {
        if (relay.url === relayUrl) {
            contains = true;
        }
    });
    return contains
}

export function removePreferredRelay(relayUrl: string) {
    let preferredRelays = getItem(RELAYS_DATA_KEY);
    if (!preferredRelays) {
        preferredRelays = [];
    }
    let newList: PreferredRelay[] = [];
    preferredRelays.forEach((preferredRelay: PreferredRelay) => {
        if (preferredRelay.url !== relayUrl) {
            newList.push(preferredRelay);
        }
    });
    updatePreferredRelays(newList);
}

export function getPreferredRelays() {
    const relays = getItem(RELAYS_DATA_KEY);
    if (relays === null) {
        return [];
    }
    return relays;
}

export function clearAllData() {
    sessionStorage.clear();
}
