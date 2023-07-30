import requests
from requests.exceptions import RequestException


def turn_relay_url_into_http_url(relay_url):
    assert relay_url.startswith("wss://") or relay_url.startswith("ws://")

    http_url = relay_url.replace("ws://", "http://").replace("wss://", "https://")
    return http_url

def get_metadata_from_relay_url(relay_url):
    http_url = turn_relay_url_into_http_url(relay_url)

    try:
        # Send a request to the user-provided URL to gather metadata
        headers = {'Accept': 'application/nostr+json'}
        response = requests.get(http_url, headers=headers, timeout=2)

        if response.status_code == 200:
            # Let's assume that the response is a JSON containing metadata
            metadata = response.json()

            return metadata

    except RequestException as e:
        # Handle or log the exception appropriately
        print(f"Failed to fetch metadata from {relay_url}. Error: {str(e)}")

