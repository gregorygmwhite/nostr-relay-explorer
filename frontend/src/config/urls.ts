type UrlId = number | string;

const urls = {
    api: {
        relaysList: '/api/relays/',
        relaysCreate: '/api/relays/',
        relaysDetail: '/api/relays/:id/',
        getRelayDetail: (relayId: UrlId): string => `/api/relays/${relayId}`,
    }
}

export default urls;
