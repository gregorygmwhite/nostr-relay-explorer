interface Nostr {
    getPublicKey(): Promise<string>;
    signEvent(event: any): Promise<any>;
}

interface Window {
    nostr: Nostr;
}
