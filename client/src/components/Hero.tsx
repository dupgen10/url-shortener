import { useState, type FormEvent } from 'react';
import { FiLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface HeroProps {
  onShorten: (url: string, customAlias?: string) => Promise<void>;
  isLoading: boolean;
}

export default function Hero({ onShorten, isLoading }: HeroProps) {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showAlias, setShowAlias] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onShorten(url.trim(), customAlias.trim() || undefined);
    setUrl('');
    setCustomAlias('');
  };

  return (
    <section className="hero">
      <div className="hero-badge">
        <span className="hero-badge-dot" />
        Free & Open Source
      </div>

      <h1 className="hero-title">Shorten. Share. Track.</h1>

      <p className="hero-subtitle">
        Transform long, unwieldy URLs into clean, trackable short links.
        Monitor clicks, analyze traffic, and share with confidence.
      </p>

      <form className="hero-form" onSubmit={handleSubmit}>
        <div className="hero-input-group">
          <input
            type="url"
            className="hero-input"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            aria-label="URL to shorten"
          />
          <button
            type="submit"
            className="hero-submit"
            disabled={isLoading || !url.trim()}
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                <FiLink size={16} />
                Shorten
              </>
            )}
          </button>
        </div>

        <div className="alias-toggle">
          <button
            type="button"
            className="alias-toggle-btn"
            onClick={() => setShowAlias(!showAlias)}
          >
            Custom alias
            {showAlias ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>

        {showAlias && (
          <div className="alias-input-wrapper">
            <input
              type="text"
              className="alias-input"
              placeholder="e.g. my-link (optional)"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              aria-label="Custom alias"
              pattern="[a-zA-Z0-9_-]*"
              title="Only letters, numbers, hyphens, and underscores"
            />
          </div>
        )}
      </form>
    </section>
  );
}
