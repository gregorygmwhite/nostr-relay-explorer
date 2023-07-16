import { relayInit } from 'nostr-tools';


const form = document.getElementById('connectForm');
const eventsDiv = document.getElementById('events');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('relay').value;

    // import and initialize the relay
    const relay = relayInit(url);

    relay.on('connect', async () => {
        console.log(`Connected to ${relay.url}`);
        try {
            // Clear the contents of the events div
            eventsDiv.innerHTML = '';

            let events = await relay.list([{ kinds: [1] }]);
            for (let event of events) {
                let eventDiv = document.createElement('div');
                eventDiv.className = 'event';
                eventDiv.textContent = JSON.stringify(event);
                eventsDiv.appendChild(eventDiv);
            }
        } catch (error) {
            console.error(`Error listing events: ${error.message}`);
        }
    });

    relay.on('error', (error) => {
        console.log(`Failed to connect to ${relay.url}: ${error}`);
    });

    // Establish a connection with the relay
    relay.connect();
});

