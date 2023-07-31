import { useState } from 'react';
import { Clipboard, Check } from 'react-bootstrap-icons';

const CopyableText = ({
  text,
  buttonAlignment = 'left',
}: {
  text: string,
  buttonAlignment?: 'left' | 'right',
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied status after 3 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (buttonAlignment === 'right') {
    return (
      <div className="d-flex flex-row w-100 justify-content-start align-items-center">
        <div className="me-2">
          {text}
        </div>
        {isCopied ? (
            <div title="copied!" className="d-flex flex-row justify-content-center align-items-center">
              <Check size={24} />
            </div>
        ) : (
            <div
              onClick={handleCopyClick}
              title="copy"
              className="d-flex flex-row justify-content-center align-items-center"
              style={{ cursor: 'pointer' }}
            >
              <Clipboard size={18} />
            </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="d-flex flex-row w-100 justify-content-start align-items-center">
        {isCopied ? (
            <div title="copied!" className="d-flex flex-row justify-content-center align-items-center me-2">
              <Check size={24} />
            </div>
        ) : (
            <div
              onClick={handleCopyClick}
              title="copy"
              className="d-flex flex-row justify-content-center align-items-center me-2"
              style={{ cursor: 'pointer' }}
            >
              <Clipboard size={18} />
            </div>
        )}
        <div >
          {text}
        </div>
      </div>
    );
  }
};

export default CopyableText;
