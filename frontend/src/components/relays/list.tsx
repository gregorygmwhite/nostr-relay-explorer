import { ReactElement, useState, useEffect } from "react";
import Relay from "../../types/relays";
import { useNavigate, Link } from 'react-router-dom';
import LoadingIndicator from "../common/loadingIndicator";
import pages from "../../config/pages";
import { Table, Button } from "react-bootstrap";
import CopyableText from "../common/copyableText";
import {
  getUserInfo,
  getPreferredRelays,
  addPreferredRelay,
  removePreferredRelay,
  READ_MARKER,
  WRITE_MARKER,
} from "../../utils/sessionStorage";
import { PreferredRelay } from "../../types/sessionStorage";

const RelaysList = ({
  relays,
}: {
  relays: Relay[];
}): ReactElement => {

  const navigate = useNavigate();


  const [user, setUser] = useState<any>(null);
  const [preferredRelays, setPreferredRelays] = useState<PreferredRelay[]>([]);

  function retrieveStoredUser() {
      const userData = getUserInfo();
      console.log("refresh user data", userData)
      setUser(userData);
  }

  function addPreferredRelayToStorage(relayUrl: string, marker: string) {
      addPreferredRelay(relayUrl, marker)
      setPreferredRelays(getPreferredRelays());
  }

  function removePreferredRelayFromStorage(relayUrl: string) {
      removePreferredRelay(relayUrl)
      setPreferredRelays(getPreferredRelays());
  }

  function inPreferredRelays(relayUrl: string) {
    let contains = false;
    preferredRelays.forEach((relay: PreferredRelay) => {
      if (relay.url === relayUrl) {
        contains = true;
      }
    });
    return contains;
  }


  useEffect(() => {
    setUser(retrieveStoredUser())
    setPreferredRelays(getPreferredRelays())
  }, []);

  return (
    <div className="mt-4">
      {relays === undefined ? (
        <LoadingIndicator />
      ) : relays.length > 0 && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="h5">
              {relays.length} matching relays
            </div>
          <Link
            to={pages.getRelaysCreate()}
            className="btn btn-primary"
            >
              Suggest Relay
          </Link>
        </div>
          {relays && (
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th>Payment Required</th>
                  <th>Preferred</th>
                </tr>
              </thead>
              <tbody>
                {relays.map((relay: Relay) => (
                  <tr key={relay.id}>
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
                    <td>
                      {inPreferredRelays(relay.url) ? (
                        <Button onClick={() => removePreferredRelayFromStorage(relay.url)} variant="danger" title="remove from preferred relay list">
                          Remove
                        </Button>
                      ):(
                        <Button onClick={() => addPreferredRelayToStorage(relay.url, WRITE_MARKER)} title="add to preferred relay list">
                          Add
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
};

export default RelaysList;
