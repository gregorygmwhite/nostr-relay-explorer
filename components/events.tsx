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
              <div key={event.id}>
                <pre>
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
