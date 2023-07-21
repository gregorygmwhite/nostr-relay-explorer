import { ReactElement } from "react";
import { Event } from "../types/event";


const EventsDisplay = ({
    events,
  }: {
    events: Event[];
  }): ReactElement => {
    return (
        <div>
            {events.map((event) => (
              <div key={event.id} className="p-6 my-4 border border-gray-300 rounded shadow">
                <pre className="overflow-auto break-all max-h-96">
                  <code>
                    {JSON.stringify(event, null, 2)}
                  </code>
                </pre>
              </div>
            ))}
        </div>
    );
  };

  export default EventsDisplay;
