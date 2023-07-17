import { relayInit } from 'nostr-tools';


const form = document.getElementById('queryForm');
const eventsDiv = document.getElementById('events');
const defaultLimit = 50;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const relayUrl = document.getElementById('relay').value;

    const kindsSelectionRaw = getSelectValues(document.getElementById('kinds-selection'));
    let kinds = parseKindsSelection(kindsSelectionRaw);

    const authorPubKey = document.getElementById('author').value;

    // import and initialize the relay
    const relay = relayInit(relayUrl);

    relay.on('connect', async () => {
        console.log(`Connected to ${relay.url}`);
        try {
            // Clear the contents of the events div
            eventsDiv.innerHTML = '';

            // Add a loading message
            let loadingEventsDiv = document.createElement('div');
            loadingEventsDiv.className = 'mt-4';
            loadingEventsDiv.textContent = 'Loading events...';
            eventsDiv.appendChild(loadingEventsDiv);

            let queries = [{ limit: defaultLimit }]

            if (kinds.length !== 0) {
                queries[0]["kinds"] = kinds;
            }

            if (authorPubKey !== "") {
                queries[0]["author"] = authorPubKey;
            }

            // get events from the relay
            let events = await relay.list(queries);

            // clear the loading message
            eventsDiv.innerHTML = '';

            // Add a count of the events
            let countDiv = document.createElement('div');
            countDiv.className = 'mb-2';
            if (events.length >= defaultLimit) {
                countDiv.textContent = `Matching first ${events.length} events`;
            } else {
                countDiv.textContent = `Matching events: ${events.length}`;
            }
            eventsDiv.appendChild(countDiv);

            // Add the events as cards
            for (let event of events) {
                let eventDiv = document.createElement('div');
                eventDiv.className = 'event card p-4 mb-4';
                let eventPreDiv = document.createElement('pre');
                let eventCodeDiv = document.createElement('code');
                eventCodeDiv.textContent = JSON.stringify(event, undefined, 2);
                eventPreDiv.appendChild(eventCodeDiv);
                eventDiv.appendChild(eventPreDiv);
                eventsDiv.appendChild(eventDiv);
            }
        } catch (error) {
            console.error(`Error listing events: ${error.message}`);

            // add error message
            let errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.textContent = `Error listing events: ${error.message}`;
            eventsDiv.appendChild(errorDiv);
        }
    });

    relay.on('error', (error) => {
        console.log(`Failed to connect to ${relay.url}: ${error}`);
    });

    // Establish a connection with the relay
    relay.connect();
});

// Return an array of the selected opion values
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];

        if (opt.selected) {
        result.push(opt.value || opt.text);
        }
    }
    return result;
}


function parseKindsSelection(selections) {
    var result = [];
    for (var i=0, iLen=selections.length; i<iLen; i++) {
        let selection = selections[i];

        if (selection === "All") {
            return []
        }

        result.push(parseInt(selection));
    }
    return result;
}
