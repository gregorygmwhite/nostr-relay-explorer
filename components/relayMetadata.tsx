import { ReactElement } from "react";
import { NostrEvent } from "../types/event";


const RelayMetadata = ({
    metadata,
  }: {
    metadata: any;
  }): ReactElement => {
    return (
      <div className="p-6 my-4 border border-gray-300 rounded shadow">
        <pre className="overflow-auto break-all max-h-96">
          <code>
            {JSON.stringify(metadata, null, 2)}
          </code>
        </pre>
      </div>
    );
  };

  export default RelayMetadata;
