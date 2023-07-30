import { useState } from 'react';
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons';

const CopyableText = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied status after 3 seconds
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div>
      {isCopied ? (
          <button className="btn" title="copied!">
            <ClipboardCheck size={16} />
        </button>
      ) : (
          <button onClick={handleCopyClick} className="btn" title="copy">
            <Clipboard size={16} />
        </button>
      )}
      {text}
    </div>
  );
};

export default CopyableText;
