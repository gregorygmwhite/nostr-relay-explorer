import { ReactElement } from "react";
import Relay from "../../types/relays";
import { useNavigate, Link } from 'react-router-dom';
import LoadingIndicator from "../common/loadingIndicator";
import pages from "../../config/pages";
import { Table } from "react-bootstrap";
import CopyableText from "../common/copyableText";

const RelaysList = ({
  relays,
}: {
  relays: Relay[];
}): ReactElement => {

  const navigate = useNavigate();

  const handleRowClick = (event: any, relayId: string) => {
    event.preventDefault();
    navigate(pages.getRelayView(relayId));
  }

  return (
    <div className="mt-4">
      {relays === undefined ? (
        <LoadingIndicator />
      ) : relays.length > 0 ? (
        <div>
          <div className="h5">
            {relays.length} results
          </div>
          {relays && (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Payment Required</th>
                </tr>
              </thead>
              <tbody>
                {relays.map((relay: Relay) => (
                  <tr>
                    <td>
                      <Link to={pages.getRelayView(relay.id)}>
                        {relay.name}
                      </Link>
                    </td>
                    <td>
                      <CopyableText text={relay.url} />
                    </td>
                    <td>
                      {relay.payment_required ? "Yes" : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      ) : (
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <p className="card-text">No relays found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelaysList;
