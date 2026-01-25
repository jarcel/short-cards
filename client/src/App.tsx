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
    <div className="app">
      <section className="hero">
        <div className="heroBackground">
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
        </div>
        <div className="heroContent">
          <div className="logo">
            <span className="logoDot" />
            <span>short.cards</span>
          </div>
          <h1 className="title">
            Contact
            <span className="titleAccent">Cards</span>
            Instantly
          </h1>
          <div className="tagline">
            <span className="taglineStep"><span className="taglineNum">01</span>Enter your info</span>
            <span className="taglineStep"><span className="taglineNum">02</span>Get a <strong>shareable link</strong></span>
            <span className="taglineStep"><span className="taglineNum">03</span>Anyone can download your short.card</span>
          </div>
        </div>
      </section>

      <section className="formSection">
        <div className="formWrapper">
          {shortUrl ? (
            <SuccessCard shortUrl={shortUrl} onCreateAnother={handleCreateAnother} />
          ) : (
            <CardForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
