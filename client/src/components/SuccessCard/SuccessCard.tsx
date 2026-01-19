import { useState } from 'react';
import styles from './SuccessCard.module.css';

interface SuccessCardProps {
  shortUrl: string;
  onCreateAnother: () => void;
}

export function SuccessCard({ shortUrl, onCreateAnother }: SuccessCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h2 className={styles.title}>vCard Created!</h2>

      <p className={styles.description}>
        Your contact card is ready. Share the link below to let others download your vCard.
      </p>

      <div className={styles.urlContainer}>
        <input
          type="text"
          value={shortUrl}
          readOnly
          className={styles.urlInput}
        />
        <button
          onClick={handleCopy}
          className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ''}`}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className={styles.actions}>
        <a
          href={shortUrl}
          className={styles.downloadButton}
          download
        >
          Download vCard
        </a>
        <button onClick={onCreateAnother} className={styles.newButton}>
          Create Another
        </button>
      </div>
    </div>
  );
}
