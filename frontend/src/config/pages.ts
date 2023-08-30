type UrlId = number | string;

const pages = {
    getHome(): string { return "/" },

    getMyRelays(): string { return "/relays/mine" },

    getRelaySearch(): string { return "/relays" },
    getRelaysCreate(): string { return "/relays/create" },
    getRelayLists(): string { return "/relay-lists" },

    getRelaysViewRaw(): string { return "/relays/:id" },
    getRelayView: (relayId: UrlId): string => `/relays/${relayId}`,

    getInspector(): string { return "/inspector" },
};

export default pages;
