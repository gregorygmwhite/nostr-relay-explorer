export function isValidRelayUrl(relayUrl: string): boolean {
    return relayUrl.startsWith("ws://") || relayUrl.startsWith("wss://");
}

export function validateRelayUrl(relayUrl: string) {
    if (!relayUrl) {
        throw new Error("Relay URL cannot be empty");
    }
    if (!relayUrl.startsWith("wss://") && !relayUrl.startsWith("ws://")) {
        throw new Error("Relay URLs must start with wss:// or ws://");
    }
}
