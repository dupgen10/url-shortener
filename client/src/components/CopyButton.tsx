import { useState } from 'react';
import { FiCheck, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <button
      className={`action-btn ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
      title="Copy to clipboard"
    >
      {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      {label && <span>{copied ? 'Copied' : label}</span>}
    </button>
  );
}
