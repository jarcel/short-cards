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
    <div className={styles.container}>
      <h2 className={styles.title}>
        Your card is
        <span className={styles.titleAccent}> ready</span>
      </h2>

      <p className={styles.description}>
        Share this link. Anyone who opens it will instantly download your short.card.
      </p>

      <div className={styles.urlBox}>
        <input
          type="text"
          value={shortUrl}
          readOnly
          className={styles.urlInput}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className={styles.actions}>
        <a href={shortUrl} className={styles.downloadButton} download>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download short.card
        </a>
        <button onClick={onCreateAnother} className={styles.newButton}>
          Create Another
        </button>
      </div>
    </div>
  );
}
