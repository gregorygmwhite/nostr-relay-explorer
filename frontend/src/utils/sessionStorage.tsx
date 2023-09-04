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

export function updatePreferredRelays(relays: string[]) {
    const currentPreferredRelays = getItem(RELAYS_DATA_KEY);
    clearItem(RELAYS_DATA_KEY);
    storeItem(RELAYS_DATA_KEY, relays);
}

export function addPreferredRelay(relay: string) {
    let preferredRelays = getItem(RELAYS_DATA_KEY);
    if (!preferredRelays) {
        preferredRelays = [];
    }
    if (!preferredRelays.includes(relay)) {
        preferredRelays.push(relay);
    }
    updatePreferredRelays(preferredRelays);
}

export function removePreferredRelay(relay: string) {
    let preferredRelays = getItem(RELAYS_DATA_KEY);
    if (!preferredRelays) {
        preferredRelays = [];
    }
    let newList: string[] = [];
    preferredRelays.forEach((preferredRelay: string) => {
        if (preferredRelay !== relay) {
            newList.push(preferredRelay);
        }
    });
    updatePreferredRelays(newList);
}

export function getPreferredRelays() {
    const relays = getItem(RELAYS_DATA_KEY);
    return relays;
}

export function clearAllData() {
    sessionStorage.clear();
}
