import { ReactElement } from "react";


const RelayMetadata = ({
    metadata,
  }: {
    metadata: any;
  }): ReactElement => {
    return (
      <pre className="overflow-auto break-all max-h-96">
        <code>
            {metadata ? (
              JSON.stringify(metadata, null, 2)
            ) : (
              "No metadata found"
            )}
        </code>
      </pre>
    );
  };

  export default RelayMetadata;
