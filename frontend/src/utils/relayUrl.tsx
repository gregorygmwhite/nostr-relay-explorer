export function isValidRelayUrl(relayUrl: string): boolean {
    return relayUrl.startsWith("ws://") || relayUrl.startsWith("wss://");
}
