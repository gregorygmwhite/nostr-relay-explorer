type UrlId = number | string;

const pages = {
    home: "/",
    relays: {
        inspector: "/relays/inspector/",
        list: "/relays",
        create: "/relays/create",
        view: "/relays/:id",
    },
    getRelayView: (relayId: UrlId): string => `/relays/${relayId}`,
};

export default pages;
