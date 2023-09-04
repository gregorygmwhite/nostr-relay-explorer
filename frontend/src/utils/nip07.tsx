export function hasNIP7Extension() {
    return !!window.nostr;
}

export async function getPublicKey() { // returns hexpubkey
    if (hasNIP7Extension()) {
        return await window.nostr.getPublicKey(); // triggers extension
    } else {
        throw new Error("no nip7 extension installed");
    }
}

export async function generateEventSignature(event: any) {
    if (hasNIP7Extension()) {
        const signedEvent = await window.nostr.signEvent(event); // triggers extension
        return signedEvent.sig;
    } else {
        throw new Error("no nip7 extension installed");
    }
}

