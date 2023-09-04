# nostr-relay-explorer
The Nostr experience is greatly influenced by the quality and number of relays you use. The purpose of Relay.Guide is to help people discover and use the relays that will maximize their enjoyment of Nostr

## Project info

### Client-side querying
This app is architected so that the connections to relays occurs on the client side (in the browser) so that it can respect the access of client to private relays.

### Methodologies
##### Calculating relay usage:
When searching for relays there is a sort option of "usage".This is calculated by querying for the latest 100 zap receipts and calculating how long the window is between the first and latest event in the list. The lower the number the "more active" the relay.

This is a very crude way to measure usage, and suggestions are welcome for a more accurate way to measure usage without special access to the relay.

##### Finding and publishing preferred relays
When managing your preferred relays Relay.Guide queries for your existing preferred relay list and also allows you to publish an updated preferred relay list. This is done via the pattern proposed in [NIP 65](https://github.com/nostr-protocol/nips/blob/master/65.md)>.

Most clients are still adding the preferred relay list as part of a contact list ( [NIP 02](https://github.com/nostr-protocol/nips/blob/master/02.md) ). There is still debate on whether the approach for managing a user's preferred relay list will use NIP 02 or NIP 65, but this project will soon support both.

### Contact
If you want to talk about anything related to this project, feel free to reach out on Nostr: gregwhite@nostrplebs.com or npub1r3fwhjpx2njy87f9qxmapjn9neutwh7aeww95e03drkfg45cey4qgl7ex2


## Setup for Development
The app is a split frontend and backend app. The frontend is a vanilla React app, the backend is a django app.


Getting started build the docker images
```bash
make build
make reset-db
```

### Setting up the frontend
```bash
make run-frontend
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend app.

### Setting up the backend
```bash
make run-backend
```

The backend is just an API that's running on [http://localhost:8000](http://localhost:8000). You can use the API via Django REST Framework UI for testing purposes, you'll also be able to use django's admin interface as a superuser to edit any of the data directly.

## Usage

Once the application is running (either in development or production), open the app in your web browser.

1. Enter a relay url (must have the protocol included `ws://` or `wss://`)
2. Click the "Connect" button to connect to the relay and start querying events.

For now all it can do is query for events on a specific relay. You can specify a selection of kinds of events as well as filter by the pubkey of the author.

## Deployment
In order to have the latest code, db schema, and run the application these are the necessary commands

### Backend deployment
```bash
make build
make reset-db
make run-backend
```

### Frontend deployment
```bash
make build
make run-frontend
```

## What's next
1. Add ability to find relay lists published by certain people (and on certain relays)
2. Add ability to login with Alby or nos2x and actually manage your relays from this tool
3. Add way to discover relays based on their metadata (paid/not paid, community preferences, nips supported, etc)
4. Support more metadata tags (languages, community preferences, link out to posting policy)

## Contributing

Contributions are always welcome! Please feel free to open an issue or create a pull request if you would like to add features, fix bugs, or make other improvements to the project.
