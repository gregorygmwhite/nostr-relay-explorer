import { ReactElement } from "react";
import { NostrEvent } from "../../types/event";
import { Card } from 'react-bootstrap';


const EventsDisplay = ({ events }: { events: NostrEvent[] }): ReactElement => {
  return (
    <div>
      {events.length > 0 && <h5 className="mb-3">Latest {events.length} Events</h5>}
      {events.map((event, index) => (
        <Card className="mb-3" key={index}>
          <Card.Body>
            <pre className="overflow-auto">
              <code>
                {JSON.stringify(event, null, 2)}
              </code>
            </pre>
          </Card.Body>
        </Card>
      ))}
      {events.length === 0 && (
        <Card className="mb-3">
          <Card.Body>
            <p>No events found</p>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default EventsDisplay;
