type UrlId = number | string;

const pages = {
    getHome(): string { return "/" },

    getRelaysList(): string { return "/relays" },
    getRelaysCreate(): string { return "/relays/create" },

    getRelaysViewRaw(): string { return "/relays/:id" },
    getRelayView: (relayId: UrlId): string => `/relays/${relayId}`,

    getInspector(): string { return "/inspector" },
};

export default pages;
