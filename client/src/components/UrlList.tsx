import { FiLink2 } from 'react-icons/fi';
import type { UrlData } from '../types';
import UrlCard from './UrlCard';

interface UrlListProps {
  urls: UrlData[];
  isLoading: boolean;
  onDelete: (shortCode: string) => void;
  onViewStats: (shortCode: string) => void;
  onViewQR: (shortCode: string) => void;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-line medium" />
      <div className="skeleton skeleton-line long" />
      <div className="skeleton skeleton-line short" style={{ marginTop: 8 }} />
      <div className="skeleton skeleton-line xs" style={{ marginTop: 12 }} />
    </div>
  );
}

export default function UrlList({
  urls,
  isLoading,
  onDelete,
  onViewStats,
  onViewQR,
}: UrlListProps) {
  if (isLoading) {
    return (
      <section className="url-list-section">
        <div className="url-list-header">
          <h2 className="url-list-title">Your Links</h2>
        </div>
        <div className="url-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (urls.length === 0) {
    return (
      <section className="url-list-section">
        <div className="empty-state">
          <div className="empty-icon">
            <FiLink2 />
          </div>
          <h3 className="empty-title">No links yet</h3>
          <p className="empty-subtitle">
            Paste a URL above to create your first short link
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="url-list-section">
      <div className="url-list-header">
        <h2 className="url-list-title">Your Links</h2>
        <span className="url-list-count">{urls.length} link{urls.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="url-grid">
        {urls.map((url, i) => (
          <UrlCard
            key={url._id}
            data={url}
            index={i}
            onDelete={onDelete}
            onViewStats={onViewStats}
            onViewQR={onViewQR}
          />
        ))}
      </div>
    </section>
  );
}
