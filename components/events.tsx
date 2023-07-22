import { ReactElement } from "react";
import { Event } from "../types/event";


const EventsDisplay = ({
    events,
  }: {
    events: Event[];
  }): ReactElement => {
    return (
      <div>
        {events.length > 0 && <div className="text-xl font-bold">First {events.length} Events</div>}
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="p-6 my-4 border border-gray-300 rounded shadow">
              <pre className="overflow-auto break-all max-h-96">
                <code>
                  {JSON.stringify(event, null, 2)}
                </code>
              </pre>
            </div>
          ))) : (
            <div className="p-6 my-4 border border-gray-300 rounded shadow">
              <p>No events found</p>
            </div>
        )}
      </div>
    );
  };

  export default EventsDisplay;
