# nostr-relay-explorer
A basic web UI for exploring events within relays.

This app is architected so that the connections to relays occurs on the client side (in the browser) so that it can respect the access of client to private relays.

## Setup for Development
The app has a nextjs server as well as a database server

First build the docker images and then run the servers

```bash
make build
make run
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can also lint the project
```bash
make lint
```

## Usage

Once the application is running (either in development or production), open the app in your web browser.

1. Enter a relay url (must have the protocol included `ws://` or `wss://`)
2. Click the "Connect" button to connect to the relay and start querying events.

For now all it can do is query for events with a "kind" of 1 and it'll display them raw in html.

## Setup for Deployment

```bash
make build
make run-production
```

## What's next
Add a relay discovery tool to allow folks to discover relays by certain attributes (paid/not paid, community preferences, nips supported, etc)

This tool would allow users to "register" a relay they're aware of and add it to the list of relays to be monitored by the tool.

These registered relays would be queried regularly to refresh this app's record of the Relay's metadata. Including information about its community preferences.

## Contributing

Contributions are always welcome! Please feel free to open an issue or create a pull request if you would like to add features, fix bugs, or make other improvements to the project.
