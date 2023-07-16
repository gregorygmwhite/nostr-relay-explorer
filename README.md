# nostr-relay-explorer
A basic web UI for exploring events within relays.

This app is architected so that the connections to relays occurs on the client side (in the browser) so that it can respect the access of client to private relays.

## Prerequisites

To run this project, you'll need:

- Node.js and npm installed on your local machine.

## Development
1. `npm install`
2. `npm run dev`

This command will start the webpack dev server, which will watch for changes in client.js and rebuild it on the fly. The dev server will be running at http://localhost:8080.

## Production
For a production environment, you'll need to build the frontend JavaScript file and then start the Express server.

Build the frontend assets:

```npm run build```

This command will create a bundle.js file in the public directory.

Start the server:

```npm start```

The server will be running on port 8080

## Usage

Once the application is running (either in development or production), open the app in your web browser.

1. Enter a relay url (must have the protocol included `ws://` or `wss://`)
2. Click the "Connect" button to connect to the relay and start querying events.

For now all it can do is query for events with a "kind" of 1 and it'll display them raw in html.

## What's next
1. Better styling so it's easier to read the events
2. Ability to specify a public key for which
3. Ability to specify the kind(s) and tag(s) for events you want to query for

## Contributing

Contributions are always welcome! Please feel free to open an issue or create a pull request if you would like to add features, fix bugs, or make other improvements to the project.
