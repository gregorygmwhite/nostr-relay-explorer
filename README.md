# nostr-relay-explorer
A basic web UI for exploring events within relays.

This app is architected so that the connections to relays occurs on the client side (in the browser) so that it can respect the access of client to private relays.

## Setup for Development
The app is a split frontend and backend app. The frontend is a vanilla React app, the backend is a django app.


Getting started build the docker images
```bash
make build
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
make migrate
make run-backend
```

### Frontend deployment
```bash
make build
make run-frontend
```

## What's next
1. Add way to discover relays based on their metadata (paid/not paid, community preferences, nips supported, etc)
2. Make the discovery interface easier to use (I suck at design)
3. Support more metadata tags (languages, community preferences, link out to posting policy)

## Contributing

Contributions are always welcome! Please feel free to open an issue or create a pull request if you would like to add features, fix bugs, or make other improvements to the project.
