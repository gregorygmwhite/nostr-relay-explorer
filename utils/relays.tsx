import axios from 'axios';

export function getRelayHTTPAddress(relayUrl: string) {
  return relayUrl.replace('wss://', 'http://').replace('ws://', 'http://');
}

export async function getRelayMetadata(relayUrl: string) {
    const httpUrl = getRelayHTTPAddress(relayUrl);
    let metadata = {};
    try {
        const response = await axios.get(httpUrl, {
        headers: {
            Accept: 'application/nostr+json',
        },
        });
        metadata = response.data;
    } catch (error) {
        console.error(error);
        return new Response('Failed to fetch metadata', {
        status: 500,
        });
    }
    return metadata;
}
