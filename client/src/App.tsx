import { useState } from 'react';
import type { ContactInfo } from '@short-cards/shared';
import { CardForm } from './components/CardForm';
import { SuccessCard } from './components/SuccessCard';
import { createCard } from './api/cards';
import './styles/global.css';

function App() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (contact: ContactInfo) => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      const result = await createCard(contact);
      setShortUrl(result.shortUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setShortUrl(null);
    setError(undefined);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Short Cards</h1>
        <p className="subtitle">Create shareable vCard links in seconds</p>
      </header>

      <main className="main">
        {shortUrl ? (
          <SuccessCard shortUrl={shortUrl} onCreateAnother={handleCreateAnother} />
        ) : (
          <CardForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </main>

      <footer className="footer">
        <p>Generate vCards on-the-fly with shareable short URLs</p>
      </footer>
    </div>
  );
}

export default App;
